import { getData, setData } from './dataStore';
import isEmail from 'validator/lib/isEmail';
import { AuthLoginV1, AuthRegisterV1 } from './dataStore';
import { generateToken, tokenToAuthUserId, isTokenValid } from './token';
import { sendMail } from './mail';
import crypto from 'crypto';

import HTTPError from 'http-errors';
import { isToken } from 'typescript';

export function adminUserPermissionChangeV1(token: string, uId: number, permissionId: number) {
  let data = getData();
  if (!isTokenValid(token)) {
    throw HTTPError(403, "invalid token");
  }
  if (!(uId in data.users)) {
    throw HTTPError(400, "invalid uId");
  }
  // change data structure to keep track of global users

  if (!(permissionId === 1 || permissionId === 2)) {
    throw HTTPError(400, "invalid permissionId");
  }

  if (data.users[uId].permission = permissionId) {
    throw HTTPError(400, "user already has permissionId");
  }
  const authUserId = tokenToAuthUserId(token, true);
  if (data.users[authUserId].permission !== 1) {
    throw HTTPError(403, "authUser does not have global ownership permissions");
  }

  // if uId refers to last global owner and they are being demoted
  if (permissionId === 1 && data.users[uId].permission === 1 && data.systemInfo.globalOwners === 1) {
    throw HTTPError(400, "uId refers to a user who is the only global owner and they are being demoted to a user");
  }
  // if adding global owner
  if (permissionId === 1) {
    data.systemInfo.globalOwners++;
  }
  data.users[uId].permission = permissionId;
  setData(data);
}