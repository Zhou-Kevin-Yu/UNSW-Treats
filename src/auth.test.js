import { authRegisterV1 } from './auth';
import { clearV1 } from './other';


describe('testing error cases', () => {
  const errorReturn = { error: 'error' };
  test('Testing invalid email', () => {
    clearV1();
    const returned = authRegisterV1("benkerno.com", "cosmoIsTheBest", "ben", "kerno");
    expect(returned).toStrictEqual(errorReturn);
  });
  
  test('Testing registering an account with an existing email', () => {
    clearV1();
    authRegisterV1("ben.kerno@gmail.com", "peanutButter", "ben", "kerno");
    const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
    expect(returned).toStrictEqual(errorReturn);
  });

  describe('Testing password cases', () => {
    test('Testing valid password (password > 6 characters)', () => {
      clearV1();
      const returned = authRegisterV1("ben.kerno@gmail.com", "cosmo", "benjamin", "kernohan");
      expect(returned).toStrictEqual(errorReturn);
    });

    test('Testing valid password (password === 6 characters)', () => {
      
    });
  });

  describe('Testing valid names', () => {
    test('Testing when nameFirst === ""', () => {
      clearV1();
      const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "", "kernohan");
      expect(returned).toStrictEqual(errorReturn);
    });

    test('Testing when nameFirst exceeds 50 characters', () => {
      clearV1();
      const name = "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm";
      expect(name.length).toBe(52);
      const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", name, "kernohan");
      expect(returned).toStrictEqual(errorReturn);
    });

    test('Testing when nameLast === ""', () => {
      clearV1();
      const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "ben", "");
      expect(returned).toStrictEqual(errorReturn);
    });

    test('Testing when nameLast exceeds 50 characters', () => {
      clearV1();
      const name = "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm";
      expect(name.length).toBe(52);
      const returned = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", name);
      expect(returned).toStrictEqual(errorReturn);
    });
  });
});

