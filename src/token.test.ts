import { tokenToAuthUserId, generateToken } from './token';

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
    const token = generateToken(1);
    expect(typeof token).toBe('string');
    const tokenSplit = token.split('.');
    expect(tokenSplit.length).toBe(2);
    expect(tokenSplit[0]).toBe(String(1));
    const tokenTwo = generateToken(1);
    expect(tokenTwo).not.toBe(token);
  });
});
