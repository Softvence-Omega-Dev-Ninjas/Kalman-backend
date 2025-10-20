import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Message } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { buildFileUrl } from 'src/helpers/urlBuilder';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Get all messages for a user (their entire history)
  @Get('history/user')
  @ApiOperation({ summary: 'Get all messages for a user' })
  async getUserChatHistory(@Req() req: any): Promise<Message[]> {
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
  async getChatPartners(@Req() req: any) {
    const userId = req.user.id;
    return this.chatService.getChatPartnersWithUser(userId);
  }

  @Post('upload')
  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // VPS folder
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const buildUrl = buildFileUrl(file.filename);
    console.log(buildUrl);
    return { url: buildUrl };
  }
}
