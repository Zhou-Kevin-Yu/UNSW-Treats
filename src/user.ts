export { userProfileV1 };
import { getData, setData } from './dataStore';
import { UserDetailsV1, User } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import isEmail from 'validator/lib/isEmail';
/**
 *
 * For a valid user, returns information about their userId,
 * email, first name, last name, and handle
 *`
 * @param {number} authUserId - authorised user that can grab into about another user
 * @param {number} uId - id of the user to be queried
 * @returns {user: {
 *            uId: number,
 *            email: string,
 *            nameFirst: string,
 *            nameLast: string,
 *            handleStr: string
 *          }} - user object of queired user
 */

function userProfileV1(authUserId: number, uId: number): UserDetailsV1 {
  const dataStore = getData();

  if (!(authUserId in dataStore.users && uId in dataStore.users)) {
    return { error: 'error' };
  }

  const data = dataStore.users[uId];
  const user: User = {
    uId: data.uId,
    email: data.email,
    nameFirst: data.nameFirst,
    nameLast: data.nameLast,
    handleStr: data.handleStr,
  };

  return { user };
}

/**
 *
 * For a valid user, returns information about their userId,
 * email, first name, last name, and handle
 * calls userProfileV1
 *`
 * @param {string} token - valid login token
 * @param {number} uId - id of the user to be queried
 */

function userProfileV2(token: string, uId: number): UserDetailsV1 {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null) {
    return { error: 'error' };
  }

  return userProfileV1(authUserId, uId);
}

// /**
//  * For a valid user, returns information about their userId, email, first name, last name, and handle
//  * calls userProfileV2
//  * @param {string} token - valid login token
//  * @param {number} uId - id of the user to be queried
//  */
// function userProfileV3(token: string, uId: number): UserDetailsV1 {
//   // const authUserId = tokenToAuthUserId(token, isTokenValid(token));
//   // if (authUserId === null) {
//   //   return { error: 'error' };
//   // }

//   return userProfileV2(token, uId);
// }

/**
 *
 * For a valid user, updates their name
 *`
 * @param {string} token - valid login token
 * @param {string} nameFirst - namefirst (must be less than 50 characters)
 * @param {string} nameLast - nameLast (must be less than 50 characters)
 */
function userProfileSetnameV1(token: string, nameFirst: string, nameLast: string): { error?: 'error' } {
  // check if token is invalid
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null) {
    return { error: 'error' };
  }

  // check if name is invalid
  if (nameFirst.length > 50 || nameFirst.length < 1) {
    return { error: 'error' };
  }
  if (nameLast.length > 50 || nameLast.length < 1) {
    return { error: 'error' };
  }

  const data = getData();
  data.users[authUserId].nameFirst = nameFirst;
  data.users[authUserId].nameLast = nameLast;
  setData(data);

  return {};
}

/**
 *
 * For a valid user, updates their email
 *`
 * @param {string} token - valid login token
 * @param {string} email - new email
 */
function userProfileSetemailV1(token: string, email: string): { error?: 'error' } {
  // check if token is invalid
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null) {
    return { error: 'error' };
  }

  // check if email is invalid
  if (!isEmail(email)) {
    return { error: 'error' };
  }

  const data = getData();

  // check if email is already registered
  for (const user of data.users) {
    if (user.email === email) {
      return { error: 'error' };
    }
  }

  data.users[authUserId].email = email;
  setData(data);

  return {};
}

/**
 *
 * For a valid user, updates their handleStr
 *`
 * @param {string} token - valid login token
 * @param {string} handle - new handle (must be greater than 3 and less than 20)
 */
function userProfileSethandleV1(token: string, handle: string): { error?: 'error' } {
  // check if token is invalid
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null) {
    return { error: 'error' };
  }

  // check the length of the handle
  if (handle.length > 20 || handle.length < 3) {
    return { error: 'error' };
  }

  // check if handle is alpa-numeric
  if (!(handle.match(/^[a-zA-Z0-9]+$/))) {
    return { error: 'error' };
  }

  // Check if handle is already taken
  const data = getData();
  for (const user of data.users) {
    if (user.handleStr === handle) {
      return { error: 'error' };
    }
  }

  data.users[authUserId].handleStr = handle;
  setData(data);

  return {};
}

export { /*userProfileV3,*/ userProfileV2, userProfileSetnameV1, userProfileSetemailV1, userProfileSethandleV1 };
