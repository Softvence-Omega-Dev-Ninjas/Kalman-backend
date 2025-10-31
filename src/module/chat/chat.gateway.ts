import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: [
      'https://pravaruka.sk',
      'https://api.pravaruka.sk',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger(ChatGateway.name);

  constructor(private chatService: ChatService) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Chat Gateway Initialized', server.adapter.name);
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`, client.handshake);
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      client.disconnect(true);
      return;
    }
    await client.join(userId);
    this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: {
      senderId: string;
      reciverId: string;
      message?: string;
      file?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Message received: ${JSON.stringify(data)}`, client.id);
    const { senderId, reciverId, message, file } = data;

    if (!message && !file) return;

    try {
      const savedMessage = await this.chatService.saveMessage({
        senderId,
        reciverId,
        content: message,
        file,
      });
      // Emit to both sender and receiver
      this.server.to(reciverId).emit('receive_message', savedMessage);
      this.server.to(senderId).emit('receive_message', savedMessage);
    } catch (err) {
      console.error('❌ Failed to save message:', err);
    }
  }
}
