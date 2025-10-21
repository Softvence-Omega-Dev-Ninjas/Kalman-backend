import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(data: {
    senderId: string;
    reciverId: string;
    content?: string;
    file?: string;
  }): Promise<Message> {
    const senderExists = await this.prisma.user.findUnique({
      where: { id: data.senderId },
    });
    const receiverExists = await this.prisma.user.findUnique({
      where: { id: data.reciverId },
    });

    if (!senderExists || !receiverExists) {
      throw new Error('Sender or receiver does not exist');
    }

    const message = await this.prisma.message.create({
      data: {
        senderId: data.senderId,
        reciverId: data.reciverId,
        message: data.content || null,
        file: data.file || null,
      },
    });

    return message;
  }

  // Get all messages that involve a user
  async getMessagesByUser(userId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { reciverId: userId }],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  //  Get all messages between two specific users
  async getMessagesBetweenUsers(
    userA: string,
    userB: string,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userA, reciverId: userB },
          { senderId: userB, reciverId: userA },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Get unique chat partners and their last message
  async getChatPartnersWithUser(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { reciverId: userId }],
      },
      select: {
        senderId: true,
        reciverId: true,
        message: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Extract unique partner IDs
    const partnerIds = new Set<string>();
    messages.forEach((msg) => {
      if (msg.senderId !== userId) partnerIds.add(msg.senderId);
      if (msg.reciverId !== userId) partnerIds.add(msg.reciverId);
    });

    // Fetch partner details
    const partners = await this.prisma.user.findMany({
      where: { id: { in: Array.from(partnerIds) } },
      select: {
        id: true,
        name: true,
        email: true,
        profile_image: true,
      },
    });

    // Attach last message for each partner
    const result = partners.map((p) => {
      const lastMessage = messages.find(
        (msg) => msg.senderId === p.id || msg.reciverId === p.id,
      );
      return { ...p, lastMessage };
    });

    return result;
  }
}
