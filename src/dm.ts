// import { sortAndDeduplicateDiagnostics } from 'typescript';
import { getData, setData } from './dataStore';
import { DmCreateV1, DmListV1, /* DmRemoveV1, */ DmDetailsV1, DmLeaveV1, DmMessagesV1 } from './dataStore';
import { Dm, DmObj, User } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';

import { userProfileV1 } from './user'; // TODO update this with userProfileV2

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
  // sort array alphabetically
  handleArrs.sort((a, b) => a.localeCompare(b));
  const len = handleArrs.length;
  let dmName = '';
  for (let i = 0; i < len; i++) {
    dmName = dmName + handleArrs[i] + ', ';
  }
  dmName = dmName.substring(0, dmName.length - 2);
  return dmName;
}

export function dmCreateV1(token: string, uIds: number[]): DmCreateV1 {
  const data = getData();
  // check if uIds are valid
  for (const uId of uIds) {
    if (!(uId in data.users)) {
      return { error: 'error' };
    }
  }
  // return error if duplicates exist
  if (new Set(uIds).size !== uIds.length) {
    return { error: 'error' };
  }
  // strip token and check if authUserId in uIds
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  const dmNum = data.dms.length;
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }
  if (uIds.includes(authUserId)) {
    return { error: 'error' };
  }
  uIds.push(authUserId);
  const dmName = generateDmName(uIds);
  const dmNew: DmObj = {
    dmId: dmNum,
    creator: authUserId,
    members: uIds,
    name: dmName,
    messages: [],
  };
  data.dms[dmNum] = dmNew;
  setData(data);
  return { dmId: dmNum };
}

export function dmListV1(token: string): DmListV1 {
  const data = getData();
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }
  const userDms: Dm[] = [];
  for (const dm of data.dms) {
    if (dm !== undefined && dm !== null && dm.members.includes(authUserId)) {
      const tempDm: Dm = {
        dmId: dm.dmId,
        name: dm.name,
      };
      userDms.push(tempDm);
    }
  }
  return { dms: userDms };
}

export function dmRemoveV1(token: string, dmId: number)/*: DmRemoveV1 */ {
  const data = getData();
  // check if dmId is valid
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined) {
    return { error: 'error' };
  }
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }
  if (data.dms[dmId].creator !== authUserId) {
    return { error: 'error' };
  }
  /* no situation where the creator is not a member (see assumptions)
  if (!(data.dms[dmId].members.includes(authUserId))) {
    return { error: 'error' };
  }
  */
  delete data.dms[dmId];
  setData(data);
}

export function dmDetailsV1(token: string, dmId: number): DmDetailsV1 {
  const data = getData();
  // check if dmId is valid
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined) {
    return { error: 'error' };
  }
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }
  // check if authUser is a member of the channel
  if (!(data.dms[dmId].members.includes(authUserId))) {
    return { error: 'error' };
  }
  const dmUsers : User[] = [];
  for (const member of data.dms[dmId].members) {
    const userCurr : User = userProfileV1(authUserId, member).user; // TODO update with V2 function
    dmUsers.push(userCurr);
  }
  // console.log(dmUsers); //temporary testing of functionality
  return {
    name: data.dms[dmId].name,
    members: dmUsers,
  };
}

export function dmLeaveV1(token: string, dmId: number): DmLeaveV1 {
  const data = getData();
  // check if dmId is valid
  // console.log("before", data.dms); //temporary testing
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined) {
    return { error: 'error' };
  }
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }
  // check if authUser is a member of the channel
  if (!(data.dms[dmId].members.includes(authUserId))) {
    return { error: 'error' };
  }
  // splice out member from array
  const index = data.dms[dmId].members.indexOf(authUserId, 0);
  if (index > -1) {
    data.dms[dmId].members.splice(index, 1);
  }
  // if leaver is creator
  if (data.dms[dmId].creator === authUserId && data.dms[dmId].members.length > 1) { // TODO figure out what happens when there is one member
    data.dms[dmId].creator = data.dms[dmId].members[0]; // set first added member as creator
  } else if (data.dms[dmId].creator === authUserId && data.dms[dmId].members.length <= 1) {
  // if current creator is trying to leave and no one else is left, then delete DM
    dmRemoveV1(token, dmId);
  }
  setData(data);
  // console.log("after", data.dms); //temporary testing
}

export function dmMessagesV1(token: string, dmId: number, start: number): DmMessagesV1 {
  return {};
}
