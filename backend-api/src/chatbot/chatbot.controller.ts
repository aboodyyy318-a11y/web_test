import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('api/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  message(@Body() body: { message: string }) {
    return this.chatbotService.reply(body.message);
  }
}
