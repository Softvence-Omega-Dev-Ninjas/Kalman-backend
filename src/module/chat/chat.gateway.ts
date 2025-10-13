import { 
  ConnectedSocket, 
  MessageBody, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  OnGatewayInit, 
  SubscribeMessage, 
  WebSocketGateway, 
  WebSocketServer 
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatService } from "./chat.service";

@WebSocketGateway({ cors: { origin: ["*", "http://localhost:3000"] } }) 
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    constructor(private chatService: ChatService) {}
    @WebSocketServer() server: Server;
    
    afterInit(server: Server) {
        console.log('Chat Gateway Initialized');
    }
    
    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (!userId) {
            client.disconnect(true);
            return;
        }
        client.join(userId);
        console.log(`Client connected: ${client.id} (User: ${userId})`);
    }

    handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId as string;
        console.log(`Client disconnected: ${client.id} (User: ${userId})`);
    }

    @SubscribeMessage('send_message')
    async handleMessage(
      @MessageBody() data: { senderId: string; reciverId: string; message?: string; file?: string },
      @ConnectedSocket() client: Socket,
    ) {
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
