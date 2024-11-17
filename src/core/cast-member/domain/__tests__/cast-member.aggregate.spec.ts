import { CastMember, CastMemberId } from '../cast-member.aggregate';

describe('CastMember Unit Tests', () => {
  beforeEach(() => {
    CastMember.prototype.validate = jest
      .fn()
      .mockImplementation(CastMember.prototype.validate);
  });

  test('constructor of cast member', () => {
    let castMember = new CastMember({ name: 'John doe', type: 1 });
    expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
    expect(castMember.name).toBe('John doe');
    expect(castMember.type).toBe(1);
    expect(castMember.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    castMember = new CastMember({
      name: 'John doe',
      type: 2,
      created_at,
    });
    expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
    expect(castMember.name).toBe('John doe');
    expect(castMember.type).toBe(2);
    expect(castMember.created_at).toBe(created_at);

    const castMemberId = new CastMemberId();
    castMember = new CastMember({
      cast_member_id: castMemberId,
      name: 'John doe',
      type: 2,
    });
    expect(castMember.cast_member_id).toBe(castMemberId);
    expect(castMember.name).toBe('John doe');
    expect(castMember.type).toBe(2);
    expect(castMember.created_at).toBeInstanceOf(Date);
  });

  describe('create command', () => {
    test('should create a cast member with command', () => {
      const castMember = CastMember.create({
        name: 'John doe',
        type: 1,
      });
      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(castMember.name).toBe('John doe');
      expect(castMember.type).toBe(1);
      expect(castMember.created_at).toBeInstanceOf(Date);
      expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
      expect(castMember.notification.hasErrors()).toBe(false);
    });
  });

  describe('cast_member actions', () => {
    const castMember = new CastMember({
      name: 'John doe',
      type: 1,
    });

    test('should change name', () => {
      castMember.changeName('John');
      expect(castMember.name).toBe('John');
      expect(castMember.notification.hasErrors()).toBe(false);
    });

    test('should change type', () => {
      castMember.changeType(2);
      expect(castMember.type).toBe(2);
      expect(castMember.notification.hasErrors()).toBe(false);
    });

    test('toJSON', () => {
      expect(castMember.toJSON()).toStrictEqual({
        cast_member_id: castMember.cast_member_id.id,
        name: castMember.name,
        type: castMember.type,
        created_at: castMember.created_at,
      });
    });
  });

  describe('CastMemberValidator', () => {
    test('should throw error when name is invalid', () => {
      const castMember = CastMember.create({
        name: 'John'.repeat(256),
        type: 1,
      });
      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });

    test('should throw error when change name', () => {
      const castMember = CastMember.create({
        name: 'John doe',
        type: 1,
      });
      castMember.changeName('John'.repeat(256));
      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
