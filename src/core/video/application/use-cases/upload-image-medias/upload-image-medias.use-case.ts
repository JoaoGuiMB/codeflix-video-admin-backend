import { IUseCase } from '@core/shared/application/use-case.interface';
import { UploadeImageMediasInput } from './uploade-image-medias.input';
import { Video, VideoId } from '@core/video/domain/video.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { IVideoRepository } from '@core/video/domain/video.repository';
import { Banner } from '@core/video/domain/banner.vo';
import { Thumbnail } from '@core/video/domain/thumbnail.vo';
import { ThumbnailHalf } from '@core/video/domain/thumbnail-half.vo';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { IUnitOfWork } from '@core/shared/domain/repository/unit-of-work.interface';
import { IStorage } from '@core/shared/application/storage.interface';

export class UploadImageMediasUseCase
  implements IUseCase<UploadeImageMediasInput, UploadeImageMediasOutput>
{
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
    private storage: IStorage,
  ) {}

  async execute(
    input: UploadeImageMediasInput,
  ): Promise<UploadeImageMediasOutput> {
    const videoId = new VideoId(input.video_id);
    const video = await this.videoRepo.findById(videoId);

    if (!video) {
      throw new NotFoundError(input.video_id, Video);
    }

    const imagesMap = {
      banner: Banner,
      thumbnail: Thumbnail,
      thumbnail_half: ThumbnailHalf,
    };

    const [image, errorImage] = imagesMap[input.field].createFromFile({
      ...input.file,
      video_id: videoId,
    });

    if (errorImage) {
      throw new EntityValidationError([{ [input.field]: [errorImage.name] }]);
    }

    if (image instanceof Banner) {
      video.replaceBanner(image);
    }

    if (image instanceof Thumbnail) {
      video.replaceThumbnail(image);
    }

    if (image instanceof ThumbnailHalf) {
      video.replaceThumbnailHalf(image);
    }

    if (!(image instanceof Error)) {
      await this.storage.store({
        data: input.file.data,
        mime_type: input.file.mime_type,
        id: image.url,
      });
    }

    this.uow.do(async () => {
      return await this.videoRepo.update(video);
    });

    return { id: input.video_id };
  }
}

export type UploadeImageMediasOutput = { id: string };
