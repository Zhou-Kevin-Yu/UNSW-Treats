import { tokenToAuthUserId, generateToken, isTokenValid } from '../token';
import { authRegisterV1 } from '../auth';
import { clearV1 } from '../other';

beforeEach(() => {
  clearV1();
});

describe('tests basic string converstion and stripping', () => {
  test('test invalidToken', () => {
    expect(tokenToAuthUserId('randomString', false)).toBe(null);
  });

  test('test validToken', () => {
    const token = String(Math.random() + 1);
    expect(tokenToAuthUserId(token, true)).toBe(1);
  });

  test('test validToken with a larger number as authUserId', () => {
    const token = String(Math.random() + 20);
    expect(tokenToAuthUserId(token, true)).toBe(20);
  });
});

describe('tests token generation', () => {
  test('basic token generation test', () => {
    authRegisterV1('test@gmail.com', 'password', 'firsdfsdfsdfst', 'lastsdfsadfs');
    authRegisterV1('test1@gmail.com', 'passwordd', 'ffirst', 'llast');
    const token = generateToken(0);
    expect(typeof token).toBe('string');
    const tokenSplit = token.split('.');
    expect(tokenSplit.length).toBe(2);
    expect(tokenSplit[0]).toBe(String(0));
    const tokenTwo = generateToken(1);
    expect(tokenTwo).not.toBe(token);
  });
});

describe('test token validation', () => {
  test('basic token validation test', () => {
    const authed = authRegisterV1('test@gmail.com', 'passasdfsadfsdword', 'fisdfasdfrst', 'lasasdfsdft');
    const token = authed.token;
    let fakeToken = (0 + Math.random()).toString();
    while (fakeToken === token) {
      fakeToken = (0 + Math.random()).toString();
    }
    expect(isTokenValid(token)).toBe(true);
    expect(isTokenValid(fakeToken)).toBe(false);
  });
});
