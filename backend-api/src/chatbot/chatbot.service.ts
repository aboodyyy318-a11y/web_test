import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InferenceClient } from '@huggingface/inference';

@Injectable()
export class ChatbotService {
  private readonly client: InferenceClient;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    const token = this.config.get<string>('HF_TOKEN');
    this.model = this.config.get<string>('HF_MODEL', 'google/gemma-2-2b-it');

    if (!token) {
      throw new Error('HF_TOKEN غير موجود في ملف .env');
    }

    this.client = new InferenceClient(token);
  }

  async reply(message: string) {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return { answer: 'اكتب سؤالك أولًا.' };
    }

    if (cleanMessage.length > 1000) {
      return { answer: 'الرسالة طويلة جدًا. اكتب سؤالًا مختصرًا.' };
    }

    try {
      const result = await this.client.chatCompletion({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'أنت مساعد متجر التقنية. أجب بالعربية باختصار ووضوح. ساعد المستخدم في فهم المنتجات وعمليات الشراء. لا تخترع سعرًا أو مخزونًا غير موجود.',
          },
          { role: 'user', content: cleanMessage },
        ],
        max_tokens: 250,
        temperature: 0.4,
      });

      return {
        answer: result.choices[0]?.message?.content?.trim() || 'لم تصل إجابة.',
      };
    } catch (error) {
      console.error('Hugging Face error:', error);
      throw new ServiceUnavailableException(
        'خدمة الذكاء الاصطناعي غير متاحة حاليًا.',
      );
    }
  }
}
