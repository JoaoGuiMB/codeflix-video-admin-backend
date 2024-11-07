import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WrapperDataInterceptor } from './nest-modules/shared-module/intercerptors/wrapper-data/wrapper-data.interceptor';
import { NotFoundFilter } from './nest-modules/shared-module/filters/not-found/not-found.filter';
import { EntityValidationErrorFilter } from './nest-modules/shared-module/filters/not-found/entity-validation-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new WrapperDataInterceptor());
  app.useGlobalFilters(new NotFoundFilter(), new EntityValidationErrorFilter());
}
bootstrap();
