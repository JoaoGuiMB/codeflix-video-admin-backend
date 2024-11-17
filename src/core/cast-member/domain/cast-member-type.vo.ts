import { ValueObject } from '@core/shared/domain/value-object';

export enum CastMemberTypes {
  ACTOR = 1,
  DIRECTOR = 2,
}

export class CastMemberType extends ValueObject {
  constructor(readonly type: CastMemberTypes) {
    super();
    this.validate();
  }

  private validate() {
    const isValid =
      this.type === CastMemberTypes.ACTOR ||
      this.type === CastMemberTypes.DIRECTOR;
    if (!isValid) {
      throw new Error('Invalid CastMemberType');
    }
  }
}

export class InvalidCastMemberTypeError extends Error {
  constructor(invalidType: any) {
    super(`Invalid cast member type: ${invalidType}`);
    this.name = 'InvalidCastMemberTypeError';
  }
}