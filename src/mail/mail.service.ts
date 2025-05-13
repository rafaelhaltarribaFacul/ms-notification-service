import { Injectable }               from '@nestjs/common';
import { PrismaService }            from '../prisma.service';
import { Mail, Prisma, MailType }   from '@prisma/client';
import DataMessage                  from './types/message';

@Injectable()
export class MailService {
  constructor(private readonly prisma: PrismaService) {}

  async getMailByIdUser(
    where: Prisma.MailWhereInput,
  ): Promise<Mail[]> {
    return this.prisma.mail.findMany({ where });
  }

  async sendMail(
    content: DataMessage,
    type: MailType,
  ): Promise<void> {
    const dest = content.idUser === '10'
      ? 'user@teste.com.br'
      : 'default@teste.com.br';
    const message = `Número do pedido: ${content.orderNumber} e Valor do pedido: R$ ${content.orderValue.toFixed(2)}`;
    console.log(`Enviando notificação (${type}) para ${dest}:\n${message}`);
  }

  async persistNotification(
    content: DataMessage,
    type: MailType,
  ): Promise<void> {
    const dest = content.idUser === '10'
      ? 'user@teste.com.br'
      : 'default@teste.com.br';
    const message = `Número do pedido: ${content.orderNumber}\nValor do pedido: R$ ${content.orderValue.toFixed(2)}`;
    await this.prisma.mail.create({
      data: {
        idUser:          content.idUser,
        mailDestination: dest,
        mailContent:     message,
        mailType:        type,
      },
    });
  }
}
