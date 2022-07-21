import { userProfileV1 } from './user';
import { authRegisterV1 } from './auth';
import { clearV1 } from './other';

beforeEach(() => {
  clearV1();
});

describe('userProfileV1 - testing invalid operations', () => {
  test('Invalid authUserId and uId', () => {
    const user = userProfileV1(1, 1);
    expect(user).toStrictEqual({ error: 'error' });
  });

  test('Invalid authUserId', () => {
    const { authUserId } = authRegisterV1('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const user = userProfileV1(null, authUserId);
    expect(user).toStrictEqual({ error: 'error' });
  });

  test('Invalid uId', () => {
    const { authUserId } = authRegisterV1('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const user = userProfileV1(authUserId, null);
    expect(user).toStrictEqual({ error: 'error' });
  });
});

describe('userProfileV1 - testing valid operations', () => {
  test('Valid authUserId and uId = authUserId', () => {
    const { authUserId } = authRegisterV1('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    expect(userProfileV1(authUserId, authUserId)).toStrictEqual({
      user: {
        uId: authUserId,
        email: 'gary.sun@student.unsw.edu.au',
        nameFirst: 'Gary',
        nameLast: 'Sun',
        handleStr: 'garysun',
      }
    });
  });

  test('Valid authUserId and uId', () => {
    const { authUserId } = authRegisterV1('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const { authUserId: uId } = authRegisterV1('manav.pawar@student.unsw.edu.au', 'mjerry1', 'Manav', 'Pawar');
    expect(userProfileV1(authUserId, uId)).toStrictEqual({
      user: {
        uId: uId,
        email: 'manav.pawar@student.unsw.edu.au',
        nameFirst: 'Manav',
        nameLast: 'Pawar',
        handleStr: 'manavpawar',
      }
    });
  });
});
