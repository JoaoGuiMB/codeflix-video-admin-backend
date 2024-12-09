import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VideosConsumers {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'video.convert',
    queue: 'micro-videos/admin',
  })
  onProcessVideo(msg: {
    video: {
      resource_id: string;
      enconded_video_folder: string;
      status: 'COMPLETED' | 'FAILED';
    };
  }) {
    console.log(msg);
  }
}
