import { authLoginV1, authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { userProfileV1 } from './users';

beforeEach(() => {
    clearV1();
});

const errorReturn = { error: 'error' };

describe('testing error cases', () => {
  test('Testing invalid email', () => {
    const returned = authRegisterV1("benkerno.com", "cosmoIsTheBest", "ben", "kerno");
    expect(returned).toStrictEqual(errorReturn);
  });
  
  test('Testing registering an account with an existing email', () => {
    authRegisterV1("ben.kerno@gmail.com", "peanutButter", "ben", "kerno");
    const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
    expect(returned).toStrictEqual(errorReturn);
  });

  describe('Testing password cases', () => {
    test('Testing invalid password (password < 6 characters)', () => {
      const returned = authRegisterV1("ben.kerno@gmail.com", "cosmo", "benjamin", "kernohan");
      expect(returned).toStrictEqual(errorReturn);
    });

    test('Testing valid password (password === 6 characters)', () => {
      authRegisterV1("etkintetik@gmail.com", "cosmo25", "etkin", "tetik");
      authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "ben", "kernohan");
      expect(authLoginV1("ben.kerno@gmail.com", "dogIsCute").authUserId).toBe(1);
    });
  });

  describe('Testing valid names', () => {
    test('Testing when nameFirst === ""', () => {
      const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "", "kernohan");
      expect(returned).toStrictEqual(errorReturn);
    });

    test('Testing when nameFirst exceeds 50 characters', () => {
      const name = "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm";
      expect(name.length).toBe(52);
      const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", name, "kernohan");
      expect(returned).toStrictEqual(errorReturn);
    });

    test('Testing when nameLast === ""', () => {
      const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "ben", "");
      expect(returned).toStrictEqual(errorReturn);
    });

    test('Testing when nameLast exceeds 50 characters', () => {
      const name = "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm";
      expect(name.length).toBe(52);
      const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", name);
      expect(returned).toStrictEqual(errorReturn);
    });
  });
});

describe('Testing valid returns from register user', () => {
  test('3 registered users', () => {
      authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
      authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "benjamin", "kernohan");
      authRegisterV1("ben.kerno2@gmail.com", "dogIsCute", "benjamin", "kernohan");
      const returned = authRegisterV1("ben.kerno3@gmail.com", "dogIsCute", "benjamin", "kernohan");
      expect(returned.authUserId).toBe(3);
    });

    test('3 registered users', () => {
      authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
      authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "benjamin", "kernohan");
      authRegisterV1("ben.kerno2@gmail.com", "dogIsCute", "benjamin", "kernohan");
      authRegisterV1("ben.kerno3@gmail.com", "dogIsCute", "benjamin", "kernohan");
      authRegisterV1("ben.kerno4@gmail.com", "dogIsCute", "benjamin", "kernohan");
      const returned = authRegisterV1("ben.kerno5@gmail.com", "dogIsCute", "benjamin", "kernohan");
      expect(returned.authUserId).toBe(5);
    });
});

describe('Testing registration', () => {
  test('test correct creation', () => {
    const authUserId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "waterbotle", "franklin").authUserId;
    const uId = authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "benjamin", "kernohan").authUserId;
    const user = userProfileV1(authUserId, uId);
    const userCorrect = {
      uId: 1,
      email: 'ben.kerno1@gmail.com',
      nameFirst: 'benjamin',
      nameLast: 'kernohan',
      handleStr: 'benjaminkernohan'
    }
    expect(user).toStrictEqual(userCorrect)
  });
});

describe('Testing Handles', () => {
  test('basic handle test', () => {
    const authUserId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "waterbotle", "franklin").authUserId;
    const uId = authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "benjamin", "kernohan").authUserId;
    const user = userProfileV1(authUserId, uId);
    expect(user.handleStr).toStrictEqual("benjaminkernohan")
  });

  test('Double handle test', () => {
    const authUserId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "ben", "kerno").authUserId;
    const uId = authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "ben", "kerno").authUserId;
    const user = userProfileV1(authUserId, uId);
    expect(user.handleStr).toStrictEqual("benkerno0")
  });

  test('Long string', () => {
    const authUserId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "b", "k").authUserId;
    const uId = authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "benjamined", "kernohandomsy").authUserId;
    const user = userProfileV1(authUserId, uId);
    expect(user.handleStr).toStrictEqual("benjaminedkernohando")
  });

  test('Triple handle test', () => {
    authRegisterV1("ben.kerno2@gmail.com", "dogIsCute", "ben", "kerno").authUserId;
    const authUserId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "ben", "kerno").authUserId;
    const uId = authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "ben", "kerno").authUserId;
    const user = userProfileV1(authUserId, uId);
    expect(user.handleStr).toStrictEqual("benkerno1")
  });

  test('> 20 length double handle', () => {
    const authUserId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamined", "kernohandomsy").authUserId;
    const uId = authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "benjamined", "kernohandomep").authUserId;
    const user = userProfileV1(authUserId, uId);
    expect(user.handleStr).toStrictEqual("benjaminedkernohando0")
  });

  test('> 20 length triple handle', () => {
    authRegisterV1("ben.kerno0@gmail.com", "dogIsCute", "benjamined", "kernohandomeert").authUserId;
    const authUserId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamined", "kernohandomsy").authUserId;
    const uId = authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "benjamined", "kernohandomep").authUserId;
    const user = userProfileV1(authUserId, uId);
    expect(user.handleStr).toStrictEqual("benjaminedkernohando1")
  });
  test('> 20 length quad handle', () => {
    authRegisterV1("ben.kerno4@gmail.com", "dogIsCute", "benjamined", "kernohandomeessdfsdfrt").authUserId
    authRegisterV1("ben.kerno0@gmail.com", "dogIsCute", "benjamined", "kernohandomeert").authUserId;
    const authUserId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamined", "kernohandomsy").authUserId;
    const uId = authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "benjamined", "kernohandomep").authUserId;
    const user = userProfileV1(authUserId, uId);
    expect(user.handleStr).toStrictEqual("benjaminedkernohando2")
  });
});
