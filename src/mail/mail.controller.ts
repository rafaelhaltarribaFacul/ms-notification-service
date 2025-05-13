import { Controller, Get, Logger, Query }  from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MailService }                      from './mail.service';
import DataMessage                          from './types/message';
import { Mail, Prisma, MailType }           from '@prisma/client';

@Controller('mail')
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  @Get('get')
  getMail(@Query('idUser') idUser: string): Promise<Mail[]> {
    return this.mailService.getMailByIdUser({ idUser });
  }

  @MessagePattern('register')
  async handleRegister(
    @Payload() payload: any,
    @Ctx()     ctx:     RmqContext,
  ) {
    const data: DataMessage = JSON.parse(payload.data.notification);
    this.logger.log(`register: ${JSON.stringify(data)}`);
    ctx.getChannelRef().ack(ctx.getMessage());
    await this.mailService.sendMail(data,     MailType.orderConfirmation);
    await this.mailService.persistNotification(
      data,
      MailType.orderConfirmation,
    );
  }

  @MessagePattern('confirmation')
  async handleConfirmation(
    @Payload() payload: any,
    @Ctx()     ctx:     RmqContext,
  ) {
    const data: DataMessage = JSON.parse(payload.data.notification);
    this.logger.log(`confirmation: ${JSON.stringify(data)}`);
    ctx.getChannelRef().ack(ctx.getMessage());
    await this.mailService.sendMail(data,     MailType.paymentConfirmation);
    await this.mailService.persistNotification(
      data,
      MailType.paymentConfirmation,
    );
  }
}
