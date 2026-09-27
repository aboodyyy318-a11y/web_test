import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('FRONTEND_ORIGIN'),
  });

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log('الخادم يعمل على المنفذ${port}');
}
void bootstrap();
