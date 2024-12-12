import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { Nack } from '@golevelup/nestjs-rabbitmq';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class RabbitmqConsumeErrorFilter<T> implements ExceptionFilter {
  static readonly NON_RETRYABLE_EXCEPTIONS = [
    NotFoundError,
    EntityValidationError,
  ];

  catch(exception: T, host: ArgumentsHost) {
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
  }
}
