import 'dotenv/config';
import { NestFactory }                      from '@nestjs/core';
import { AppModule }                        from './app.module';
import { Transport, MicroserviceOptions }   from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls:        [process.env.RABBITMQ_URL!],
      queue:       'notification',
      noAck:       false,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
