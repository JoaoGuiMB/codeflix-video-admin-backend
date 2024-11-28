import {
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { FileMediaInput } from '../common/file-media.input';

export class UploadeImageMediasInput {
  @IsString()
  @IsNotEmpty()
  video_id: string;

  @IsIn(['banner', 'thumbnail', 'thumbnail_half'])
  @IsNotEmpty()
  field: 'banner' | 'thumbnail' | 'thumbnail_half';

  @ValidateNested()
  file: FileMediaInput;

  constructor(props?: UploadeImageMediasInput) {
    if (!props) return;
    this.video_id = props.video_id;
    this.field = props.field;
    this.file = props.file;
  }
}

export class ValidateUploadImageMediasInput {
  static validate(input: UploadeImageMediasInput) {
    return validateSync(input);
  }
}
