import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { CastMembersModule } from './nest-modules/cast-members-module/cast-members.module';
import { GenresModule } from './nest-modules/genres-module/genres.module';
import { VideosModule } from './nest-modules/videos-module/videos.module';
import { EventModule } from './nest-modules/event-module/event.module';
import { UseCaseModule } from './nest-modules/use-case-module/use-case.module';
import { RabbitMQFakeConsumer } from './rabbitmq-fake.consumer';
import { RabbitmqFakeController } from './rabbitmq-fake/rabbitmq-fake.controller';
import { RabbitmqModule } from './nest-modules/rabbitmq-module/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    DatabaseModule,
    CategoriesModule,
    CastMembersModule,
    EventModule,
    UseCaseModule,
    GenresModule,
    VideosModule,
    // RabbitMQModule.forRoot(RabbitMQModule, {
    //   uri: 'amqp://admin:admin@rabbitmq:5672',
    // }),
    RabbitmqModule.forRoot(),
  ],
  controllers: [RabbitmqFakeController],
  providers: [RabbitMQFakeConsumer],
})
export class AppModule {}
