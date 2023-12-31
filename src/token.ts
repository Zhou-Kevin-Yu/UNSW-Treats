import { getData } from './dataStore';
import { hashThis, SECRET } from './auth';

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

  let fullToken = { strToken: "0"};
  try {
    fullToken = JSON.parse(token);
    // check if fullToken has correct keys
    if (!fullToken.hasOwnProperty('strToken') || !fullToken.hasOwnProperty('hashToken')) {
      return null;
    }
  } catch (error) {
    return null;
  }

  const strToken = fullToken.strToken;

  // Check if token is a float
  if (strToken.includes('.')) {
    const testToken = strToken.replace('.', '');
    // Check if remaining is a number
    if ((testToken.match(/^\d+$/)) === null) {
      return null;
    }
  } else {
    return null;
  }
  if (isNaN(Number(strToken))) {
    return null;
  }
  if (strToken.indexOf('.') === -1 || strToken.indexOf('.') === 0) {
    return null;
  }

  const tokenSplit = strToken.split('.');
  if (tokenSplit.length !== 2) {
    return null;
  }
  const authUserId = parseInt(tokenSplit[0]);

  return authUserId;
}

/**
 * @param {number} authUserId - authUserId to be converted to token
 * @returns {string} - token when authUserId is valid and can be converted to token
 * @returns {null} - when authUserId is invalid and can't be converted to token
*/
function generateToken(authUserId: number): string {
  const data = getData();
  const usertokens = data.users[authUserId].tokens;

  let token = authUserId + Math.random();
  let strToken = token.toString();
  while (usertokens.includes(strToken)) {
    token = authUserId + Math.random();
    strToken = token.toString();
  }

  return JSON.stringify({
    strToken: strToken,
    hashToken: hashThis(strToken + SECRET),
  });
}

/**
 *
 * @param {token} - token to be checked
 * @returns {boolean} - whether token is valid or not
 */
function isTokenValid(token: string): boolean {
  const data = getData();
  const tryAuthUserId = tokenToAuthUserId(token, true);
  if (tryAuthUserId === null) {
    return false;
  } else if (tryAuthUserId < 0 || tryAuthUserId >= data.users.length) {
    return false;
  }

  const usertokens = data.users[tryAuthUserId].tokens;
  return usertokens.includes(token);
}

export { tokenToAuthUserId, generateToken, isTokenValid };
