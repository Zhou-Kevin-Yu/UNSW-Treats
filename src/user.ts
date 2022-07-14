import { getData, setData } from './dataStore';
import { UserDetailsV1 } from './dataStore';
import { userProfileV1 } from './users';
import { tokenToAuthUserId, isTokenValid } from './token';
import isEmail from 'validator/lib/isEmail';

function userProfileV2(token: string, uId: number): UserDetailsV1 {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null) {
    return { error: 'error' };
  }
  return userProfileV1(authUserId, uId);
}

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

  return {};
}

export { userProfileV2, userProfileSetnameV1, userProfileSetemailV1, userProfileSethandleV1 };
