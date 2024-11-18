import { CastMemberTypes } from '@core/cast-member/domain/cast-member-type.vo';
import { IsNotEmpty, validateSync, IsString, IsInt } from 'class-validator';

export type CreateCastMemberInputConstructorProps = {
  name: string;
  type: number;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  type: CastMemberTypes;

  constructor(props: CreateCastMemberInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.type = props.type;
  }
}

export class ValidateCreateCastMemberInput {
  static validate(input: CreateCastMemberInput) {
    return validateSync(input);
  }
}
