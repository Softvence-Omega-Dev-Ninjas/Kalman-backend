import { Controller, Get, Param, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Message } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Get all messages for a user (their entire history)
  @Get('history/user')
  @ApiOperation({ summary: 'Get all messages for a user' })
  async getUserChatHistory(@Req() req:any): Promise<Message[]> {
    const userId = req.user.id;
    return this.chatService.getMessagesByUser(userId);
  }

  //  Get all messages between two users
  @Get('history/:userA/:userB')
  @Public()
  @ApiOperation({ summary: 'Get all messages between two users' })
  @ApiParam({ name: 'userA', description: 'User A ID' })
  @ApiParam({ name: 'userB', description: 'User B ID' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  async getMessagesBetweenUsers(
    @Param('userA') userA: string,
    @Param('userB') userB: string,
  ): Promise<Message[]> {
    return this.chatService.getMessagesBetweenUsers(userA, userB);
  }

  //  Get all chat partners for a user (unique users you have chatted with)
  @Get('partners')
  @ApiOperation({ summary: 'Get all chat partners for a user' })
  async getChatPartners(@Req() req:any) {
    const userId = req.user.id;
    return this.chatService.getChatPartnersWithUser(userId);
  }
}
