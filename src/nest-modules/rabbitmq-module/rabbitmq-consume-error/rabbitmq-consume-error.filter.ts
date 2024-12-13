import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConsumeMessage, MessagePropertyHeaders } from 'amqplib';

@Catch()
export class RabbitmqConsumeErrorFilter implements ExceptionFilter {
  static readonly RETRY_COUNT_HEADER = 'x-retry-count';
  static readonly MAX_RETRIES = 3;
  static readonly NON_RETRYABLE_EXCEPTIONS = [
    NotFoundError,
    EntityValidationError,
  ];

  constructor(private amqpConnection: AmqpConnection) {}

  async catch(exception: Error, host: ArgumentsHost) {
    if (host.getType<'rmq'>() !== 'rmq') {
      return;
    }

    const hasRetriableError =
      RabbitmqConsumeErrorFilter.NON_RETRYABLE_EXCEPTIONS.some(
        (errorClass) => exception instanceof errorClass,
      );

    if (hasRetriableError) {
      return new Nack(false);
    }

    const ctx = host.switchToRpc();
    const message: ConsumeMessage = ctx.getContext();

    if (
      message.properties.headers &&
      this.shouldRetry(message.properties.headers)
    ) {
      console.log('RabbitMQConsumeErrorFilter catch', exception);
      console.log(
        'RabbitMQConsumeErrorFilter host',
        message.properties.headers['x-retry-count'],
      );

      await this.retry(message);
    } else {
      return new Nack(false);
    }
  }

  private shouldRetry(messageHeaders: MessagePropertyHeaders): boolean {
    const retryHeader = RabbitmqConsumeErrorFilter.RETRY_COUNT_HEADER;
    const maxRetries = RabbitmqConsumeErrorFilter.MAX_RETRIES;
    return (
      !(retryHeader in messageHeaders) ||
      messageHeaders[retryHeader] < maxRetries
    );
  }

  private async retry(message: ConsumeMessage) {
    const messageHeaders = message.properties.headers;
    const retryHeader = RabbitmqConsumeErrorFilter.RETRY_COUNT_HEADER;
    if (messageHeaders) {
      messageHeaders[retryHeader] = messageHeaders[retryHeader]
        ? messageHeaders[retryHeader] + 1
        : 1;
      messageHeaders['x-delay'] = 5000; // 5 seconds
      await this.amqpConnection.publish(
        'direct.delayed',
        message.fields.routingKey,
        message.content,
        {
          correlationId: message.properties.correlationId,
          headers: messageHeaders,
        },
      );
    }
  }
}
