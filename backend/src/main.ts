import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exceptions.filters';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
  logger.log('Backend listening on port 3000');
}
bootstrap();
