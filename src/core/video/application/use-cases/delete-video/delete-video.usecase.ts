import { VideoId } from '@core/video/domain/video.aggregate';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IVideoRepository } from '../../../domain/video.repository';

export class DeleteVideoUseCase
  implements IUseCase<DeleteVideoInput, DeleteVideoOutput>
{
  constructor(private videoRepo: IVideoRepository) {}

  async execute(input: DeleteVideoInput): Promise<DeleteVideoOutput> {
    const uuid = new VideoId(input.id);
    await this.videoRepo.delete(uuid);
  }
}

export type DeleteVideoInput = {
  id: string;
};

type DeleteVideoOutput = void;
