import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQFakeConsumer {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    queue: 'fake-queue',
    routingKey: 'fake-key',
  })
  handleMessage(message: string) {
    console.log('Received message: ', message);
  }
}