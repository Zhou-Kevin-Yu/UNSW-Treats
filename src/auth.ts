import { getData, setData } from './dataStore';
import isEmail from 'validator/lib/isEmail';
import { AuthLoginV1, AuthRegisterV1 } from './dataStore';
import { generateToken, tokenToAuthUserId, isTokenValid } from './token';
import { sendMail } from './mail';
import crypto from 'crypto';
import config from './config.json';

import HTTPError from 'http-errors';

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

const SECRET = 'DREAMTEAM'

/**
 * Given a registered user's email and password,
 * returns their `authUserId` value.
 *
 * @param {string} email - email address to login with
 * @param {string} password - password to login with
 * @return { token: number, authUserId: number} - object with key authUserId of the valid user and token
 * @returns { error : 'error' } - when email is not registered
 *                             - when password is incorrect
*/
function authLoginV1(email: string, password: string): AuthLoginV1 {
  const data = getData();
  const hashedPassword = hashThis(password+SECRET);
  for (const user in data.users) {
    if (data.users[user].email === email && data.users[user].password === hashedPassword) {
      const token = generateToken(data.users[user].uId);
      data.users[user].tokens.push(token);
      setData(data);
      return { token: token, authUserId: data.users[user].uId };
    }
  }
  return { error: 'error' };
}

/**
 * registers a unique user into the system with a unique handle. The first
 * user in the system is granted as a global user with permission = 1. all
 * subsequent users are granted with permission = 2.
 *
 * @param {number} email - email address to be validated using validator
 * @param {number} password - password (valid if length >= 6)
 * @param {number} nameFirst  - first name
 * @param {number} nameLast  - second name
 * @return {token: number, authUserId: number} - object with key authUserId of the valid user and token
 * @returns { error : 'error' } - when email has already been registered
 *                              - when password < 6 in length
 *                              - when nameFirst or nameLast > 50 or < 1
 *
 */
function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string): AuthRegisterV1 {
  const data = getData();
  if (!isEmail(email)) {
    return { error: 'Email is invalid.' };
  }
  for (const user of data.users) {
    if (user.email === email) {
      return { error: 'Email is taken.' };
    }
  }
  if (password.length < 6) {
    return { error: 'Password too short.' };
  }
  if (nameFirst.length > 50 || nameFirst.length < 1) {
    return { error: 'First name is not between 1 and 50 characters inclusive.' };
  }
  if (nameLast.length > 50 || nameLast.length < 1) {
    return { error: 'Last name is not between 1 and 50 characters inclusive.' };
  }
  // all data should be valid at this point

  // create handle
  const handle = handleCreate(nameFirst, nameLast);
  const authUserId = data.users.length;

  // determine permission
  let perm = 0;
  if (data.users.length === 0) {
    perm = 1;
    data.systemInfo.globalOwners++;
  } else {
    perm = 2;
  }

  // create token

  // create new object in users array and populate fields
  data.users[authUserId] = {
    uId: authUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    handleStr: handle,
    password: hashThis(password+SECRET),
    permission: perm,
    tokens: [],
    resetCodes: [],
    profileImgUrl: `src/photos/default.jpg`
  };
  setData(data);
  const token = generateToken(authUserId);
  data.users[authUserId].tokens.push(token);
  setData(data);
  return { token, authUserId };
}

/**
 * helper function for authRegister.
 * takes in first and last name and returns handleString
 *
 * @param {Object} data - datastore object containing all information about channels and users
 * @param {string} nameFirst - first name
 * @param {string} nameLast  - last name
 * @return {string} - concatenated string to be handleStr
 *
 */
function handleCreate(nameFirst: string, nameLast: string): string {
  nameFirst = nameFirst.toLowerCase();
  nameLast = nameLast.toLowerCase();
  nameFirst = nameFirst.replace(/[^a-z0-9]/gi, '');
  nameLast = nameLast.replace(/[^a-z0-9]/gi, '');
  let handle = nameFirst.concat('', nameLast);
  const data = getData();
  // ensure handle is 20 characters or less
  if (handle.length > 20) {
    handle = handle.slice(0, 20);
  }
  const originalHandle = handle;
  let taken = true;
  let count = 0;
  // while (taken) {
  //   taken = false;
  //   // Gary: Use .find()
  //   for (const user of data.users) {
  //     if (user.handleStr === handle) {
  //       // when count > 0 string already has a number on the end
  //       if (count !== 0) {
  //         // this won't work for larger numbers
  //         handle = handle.slice(0, -1);
  //       }
  //       handle = handle.concat('', count.toString());
  //       count++;
  //       taken = true;
  //     }
  //   }
  // }
  while (taken) {
    taken = false;
    if ((data.users.find(user => user.handleStr === handle)) !== undefined) {
      taken = true;
      handle = originalHandle.concat('', count.toString());
      count++;
    }
  }
  return handle;
}

function wrappedAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): AuthRegisterV1 {
  const returned = authRegisterV1(email, password, nameFirst, nameLast);
  if ('error' in returned) {
    throw HTTPError(400, returned.error);
  }
  return returned;
}

/**
 * Given a active token, invalidates the token to log the user out
 *
 * @param {string} token - token to be invalidated
 * @return {} - no return value
 *
*/
function authLogoutV1 (token: string): { error?: 'error' } {
  if (isTokenValid(token)) {
    const data = getData();
    const authUserId = tokenToAuthUserId(token, true);
    const userTokens = data.users[authUserId].tokens;
    data.users[authUserId].tokens = userTokens.filter(t => t !== token);
    setData(data);
  }
  return {};
}

function hashThis (unhashed: string): string {
  return crypto.createHash('sha256').update(unhashed).digest('hex');
}


// Generates a reset Code and makes it active
function generateResetCode (email: string): string {
  const data = getData();
  const user = data.users.find(user => user.email === email);
  if (user === undefined || user === null) {
    throw  HTTPError(400, 'Not for you to access, only testing purposes');
  }
  const resetCodes = user.resetCodes;

  let resetObj = {
    cur: user.uId,
    code: hashThis((Math.random()).toString()+SECRET+(Date.now()).toString()),
  }

  let resetCode = JSON.stringify(resetObj);

  while(resetCode in resetCodes) {
    let resetObj = {
      cur: user.uId,
      code: hashThis((Math.random()).toString()+SECRET+(Date.now()).toString()),
    }
  
    let resetCode = JSON.stringify(resetObj);
  }

  data.users[user.uId].resetCodes.push(resetCode);

  setData(data);

  return resetCode;
}

function authPasswordResetResetV1 (resetCode: string, newPassword: string) {
  if (newPassword.length < 6) {
    throw HTTPError(400, 'New password too short.');
  }

  const data = getData();
  let fullResetCode = { cur: 0, code: '' };
  try {
    fullResetCode = JSON.parse(resetCode);
    if (!fullResetCode.hasOwnProperty('cur') || !fullResetCode.hasOwnProperty('code')) {
      throw new Error('Invalid reset code.');
    }
  } catch (error) {
    throw HTTPError(400, 'Invalid reset code.');
  }

  const resetObj = fullResetCode;
  const user = data.users[resetObj.cur];
  if (user === undefined || user === null) {
    throw HTTPError(400, 'Invalid reset code.');
  }

  const resetCodes = user.resetCodes;

  if (!(resetCodes.includes(resetCode))) {
    throw HTTPError(400, 'Invalid reset code.');
  }
  // TODO: remove used reset code
  data.users[user.uId].resetCodes = resetCodes.filter(code => code !== resetCode);
  data.users[user.uId].password = hashThis(newPassword+SECRET);

  setData(data);

  return {};
}

function authPasswordResetRequestV1 (email: string) {
  const data = getData();
  if (data.users.find(user => user.email === email) === undefined) {
    return {}; 
  }
  const resetCode = generateResetCode(email);

  // TODO check if front end ads / with JSON 
  const formattedResetCode = resetCode.replace(/"/gm, '\\"');
  sendMail(email, resetCode, formattedResetCode);

  return {};
}

export { authLoginV1, authRegisterV1, authLogoutV1, hashThis, SECRET, wrappedAuthRegister, generateResetCode, authPasswordResetResetV1, authPasswordResetRequestV1 };
