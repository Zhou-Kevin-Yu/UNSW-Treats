import { getData } from './dataStore';

/**
 *
 * @param {number} token - token to be converted to authUserId
 * @param {boolean} tokenValid - whether token is valid or not
 * @returns {number} - authUserId when token is valid and can be converted to authUserId
 * @returns {null} - when token is invalid and can't be converted to authUserId
 */

function tokenToAuthUserId(token: string, tokenValid: boolean): number {
  if (!tokenValid) {
    return null;
  }
  // Check if token is a float
  // This could be improved later
  if (token.includes('.')) {
    const testToken = token.replace('.', '');
    // Check if remaining is a number
    if ((testToken.match(/^\d+$/)) === null) {
      return null;
    }
  } else {
    return null;
  }

  const tokenSplit = token.split('.');
  if (tokenSplit.length !== 2) {
    return null;
  }
  const authUserId = parseInt(tokenSplit[0]);

  return authUserId;
}

function generateToken(authUserId: number): string {
  const data = getData();
  const usertokens = data.users[authUserId].tokens;

  let token = authUserId + Math.random();
  let strToken = token.toString();
  while (usertokens.includes(strToken)) {
    token = authUserId + Math.random();
    strToken = token.toString();
  }

  return strToken;
}

function isTokenValid(token: string): boolean {
  const data = getData();
  const tryAuthUserId = tokenToAuthUserId(token, true);
  if (tryAuthUserId === null) {
    return false;
  } else if (tryAuthUserId < 0 || tryAuthUserId >= data.users.length) {
    return false;
  }

  const usertokens = data.users[tryAuthUserId].tokens;
  if (usertokens.includes(token)) {
    return true;
  } else {
    return false;
  }
}

export { tokenToAuthUserId, generateToken, isTokenValid };
