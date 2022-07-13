import { sortAndDeduplicateDiagnostics } from 'typescript';
import { getData, setData } from './dataStore';
import { DmCreateV1, DmListV1, DmRemoveV1, DmDetailsV1, DmLeaveV1, DmMessagesV1 } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';

import { userProfileV1 } from './users'; //TODO update this with userProfileV2

/**
 * given a token and user ids, creates a new DM (direct message),
 * returns Id of dm.
 *
 * @param {string} token - user login token
 * @param {number[]} uIds - array of userIds that the DM is created for
 * @return { dmId: number} - object with key authUserId of the valid user and token
 * @returns { error : 'error' } - when any uIds are invalid
 *                              - duplicate uIds in uId array
 *                              - when user creating the dm is also in the uIds array
*/
function generateDmName(uIds: number[]) {
  const handleArrs = [];
  const authUser = uIds[0];
  for (const uId of uIds) {
    const user = userProfileV1(authUser, uId);
    handleArrs.push(user.user.handleStr);
  }
  //sort array alphabetically
  handleArrs.sort((a, b) => a.localeCompare(b));
  const len = handleArrs.length;
  let dmName = "";
  for (let i = 0; i < len; i++) {
    dmName = dmName + handleArrs[i]
    if (i !== len) {
      dmName = dmName + ', ';
    }
  }
  return dmName;
}

export function dmCreateV1(token: string, uIds: number[]): DmCreateV1 {
  let data = getData();
  //check if uIds are valid
  for (const uId of uIds) {
    if (!(uId in data.users)) {
      return { error: 'error' };
    }
  }
  //return error if duplicates exist
  if (new Set(uIds).size !== uIds.length) {
    return { error: 'error' };
  }
  
  //strip token and check if authUserId in uIds
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  const dmNum = data.dms.length;
  if (uIds.includes(authUserId)) {
    return { error: 'error' };
  }
  uIds.push(authUserId);
  const dmName = generateDmName(uIds);
  const dmNew = {
    dmId: dmNum,
    creator: authUserId,
    members: uIds,
    name: dmName,
    messages : [],
  }
  data.dms[dmNum] = dmNew;
  setData(data);
  return { dmId: dmNum };
}

export function dmListV1(token: string): DmListV1 {
  return {};
}

export function dmRemoveV1(token: string, dmId: number): DmRemoveV1 {
  return {};
}

export function dmDetailsV1(token: string, dmId: number): DmDetailsV1 {
  return {};
}

export function dmLeaveV1(token: string, dmId: number): DmLeaveV1 {
  return {};
}

export function dmMessagesV1(token: string, dmId: number, start: number): DmMessagesV1 {
  return {};
}
