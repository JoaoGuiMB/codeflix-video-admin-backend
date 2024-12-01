import { IDomainEventHandler } from '@core/shared/application/domain-event-handler.interface';
import { VideoAudioMediaReplaced } from '@core/video/domain/domain-events/video-audio-media-replaced';
import { OnEvent } from '@nestjs/event-emitter';

export class PublishVideoMediaReplacedInQueueHandler
  implements IDomainEventHandler
{
  @OnEvent(VideoAudioMediaReplaced.name)
  async handle(event: VideoAudioMediaReplaced) {
    console.log(event);
  }
}
