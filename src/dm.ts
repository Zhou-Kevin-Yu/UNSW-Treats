// import { sortAndDeduplicateDiagnostics } from 'typescript';
import { getData, setData } from './dataStore';
import { DmCreateV1, DmListV1, /* DmRemoveV1, */ DmDetailsV1, DmLeaveV1, DmMessagesV1 } from './dataStore';
import { Dm, DmObj, User, MessagesObj } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';

import { userProfileV1 } from './user'; // TODO update this with userProfileV2

import HTTPError from 'http-errors';

/**
 * given array of user ids, make a string for the name of a dm
 * The name should be an alphabetically-sorted, comma-and-space-separated
 *  array of user handles, e.g. 'ahandle1, bhandle2, chandle3'.
 *
 * @param {number[]} uIds - array of userIds that the DM is created for
 * @returns {string}  - concatenated string
 *
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
  // add authUser to members uids array before setting data
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

export function dmCreateV3(token: string, uIds: number[]): DmCreateV1 {
  const data = getData();
  // check if uIds are valid
  for (const uId of uIds) {
    if (!(uId in data.users)) {
      throw HTTPError(400, 'One or more userIds are invalid');
    }
  }
  // return error if duplicates exist
  if (new Set(uIds).size !== uIds.length) {
    throw HTTPError(400, 'One or more userIds are duplicated');
  }
  // strip token and check if authUserId in uIds
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  const dmNum = data.dms.length;
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Invalid token');
  }
  if (uIds.includes(authUserId)) {
    throw HTTPError(400, 'UserIds cannot include the userId of the user creating the DM');
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

/**
 * given a valid token, lists the dms that the user is a part of
 *
 * @param {string} token - user login token
 * @return { dms: Dm[]} - array of Dms the user is part of
 * @returns { error : 'error' } - if token is invalid
 *
*/
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

export function dmListV3(token: string): DmListV1 {
  const data = getData();
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Invalid token');
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

/**
 * given a valid token of an authorised user and a dmId, deletes the Dm.
 *
 * @param {string} token - user login token
 * @param {number} dmId - user login token
 * @return { dms: Dm[]} - array of Dms the user is part of
 * @returns { error : 'error' } - if token is invalid
 *
*/
export function dmRemoveV1(token: string, dmId: number)/*: DmRemoveV1 */ {
  const data = getData();
  // check if dmId is valid
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined || data.dms[dmId] === null) {
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
  // let newDms: DmObj[] = [];
  // newDms = data.dms.filter((dm) => dm.dmId !== dmId);
  // for (const i in newDms) {
  //   newDms[i].dmId = parseInt(i);
  // }
  // data.dms = newDms;
  setData(data);
  return {};
}

export function dmRemoveV3(token: string, dmId: number) {
  const data = getData();
  // check if dmId is valid
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined || data.dms[dmId] === null) {
    throw HTTPError(400, 'Invalid dmId');
  }
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Invalid token');
  }
  if (data.dms[dmId].creator !== authUserId) {
    throw HTTPError(403, 'authorised user is not the original creator of the dm');
  }
  /* no situation where the creator is not a member (see assumptions)
  if (!(data.dms[dmId].members.includes(authUserId))) {
    return { error: 'error' };
  }
  */
  delete data.dms[dmId];
  setData(data);
  return {};
}

/**
 * given a valid token and dmId, it returns name and members of that Dm
 *
 * @param {string} token - user login token
 * @param {number} dmId - dmId
 * @return {DmDetailsV1} - array of Dms the user is part of
 *
*/
export function dmDetailsV1(token: string, dmId: number): DmDetailsV1 {
  const data = getData();
  // check if dmId is valid
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined || data.dms[dmId] === null) {
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

export function dmDetailsV3(token: string, dmId: number): DmDetailsV1 {
  const data = getData();
  // check if dmId is valid
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined || data.dms[dmId] === null) {
    throw HTTPError(400, 'Invalid dmId');
  }
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Invalid token');
  }
  // check if authUser is a member of the channel
  if (!(data.dms[dmId].members.includes(authUserId))) {
    throw HTTPError(403, 'authorised user is not a member of the dm');
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

/**
 * given a valid token and dmId, it allows the user to leave the Dm
 *
 * @param {string} token - user login token
 * @param {number} dmId - dmId
 * @return {error: 'error'} - if token or dmId is invalid
 *
*/
export function dmLeaveV1(token: string, dmId: number): DmLeaveV1 {
  const data = getData();
  // check if dmId is valid
  // console.log("before", data.dms); //temporary testing
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined || data.dms[dmId] === null) {
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
  return {};
}

export function dmLeaveV3(token: string, dmId: number): DmLeaveV1 {
  const data = getData();
  // check if dmId is valid
  // console.log("before", data.dms); //temporary testing
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined || data.dms[dmId] === null) {
    throw HTTPError(400, 'Invalid dmId');
  }
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Invalid token');
  }
  // check if authUser is a member of the DM
  if (!(data.dms[dmId].members.includes(authUserId))) {
    throw HTTPError(403, 'authorised user is not a member of the dm');
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
  return {};
}


/**
 * given a token and user ids, creates a new DM (direct message),
 * returns Id of dm.
 *
 * @param {string} token - user login token
 * @param {number} dmId - dmId
 * @param {number} start - start index of the message (i.e 0 = first message)
 * @return  {
 *            messages: MessageObj[]
 *            start: number;
 *            end: number;
 *          } - object containing messageObject array, start and end (-1 if no messages left)
 *            - if more messages are remaining end = start + 50
 * @returns { error : 'error' } - token, dmId is invalid
 *                              - start is greater than total messages in Dm
 *                              - tokened user not in DM with DmId: DmId
*/
export function dmMessagesV1(token: string, dmId: number, start: number): DmMessagesV1 {
  const data = getData();
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }
  // check if dmId is valid
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined || data.dms[dmId] === null) {
    return { error: 'error' };
  }
  // start is greater than total number of messages in the channel
  if (start > (data.dms[dmId].messages.length)) {
    return { error: 'error' };
  }
  //
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  // error if user is not in dm with dmId: dmId
  if (!(data.dms[dmId].members.includes(authUserId))) {
    return { error: 'error' };
  }
  const messagesReturn : MessagesObj[] = [];
  const dm : DmObj = data.dms[dmId];
  let counter = 0;
  let endM = -1;
  for (const message of dm.messages) {
    if (counter >= 50) {
      endM = start + 50;
      break;
    }
    // const messageCurr = {
    //   messageId: message.messageId,
    //   uId: message.uId,
    //   message: message.message,
    //   timeSent: message.timeSent
    // };
    const messageCurr = message;
    messagesReturn.push(messageCurr);
    counter++;
  }
  messagesReturn.reverse();
  for (const message of messagesReturn) {
    for (const reactObj of message.reacts) {
      if (reactObj.uIds.includes(authUserId)) {
        reactObj.isThisUserReacted = true;
      } else {
        reactObj.isThisUserReacted = false;
      }
    }
  }

  const returnObj : DmMessagesV1 = {
    messages: messagesReturn,
    start: start,
    end: endM,
  }
  return returnObj;
}

export function dmMessagesV3(token: string, dmId: number, start: number): DmMessagesV1 {
  const data = getData();
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Invalid token');
  }
  // check if dmId is valid
  if (dmId > data.dms.length || dmId < 0 || data.dms[dmId] === undefined || data.dms[dmId] === null) {
    throw HTTPError(400, 'Invalid dmId');
  }
  // start is greater than total number of messages in the channel
  if (start > (data.dms[dmId].messages.length)) {
    throw HTTPError(400, 'Invalid start');
  }
  //
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  // error if user is not in dm with dmId: dmId
  if (!(data.dms[dmId].members.includes(authUserId))) {
    throw HTTPError(403, 'authorised user is not a member of the dm');
  }
  const messagesReturn : MessagesObj[] = [];
  const dm : DmObj = data.dms[dmId];
  let counter = 0;
  let endM = -1;
  for (const message of dm.messages) {
    if (counter >= 50) {
      endM = start + 50;
      break;
    }
    // const messageCurr = {
    //   messageId: message.messageId,
    //   uId: message.uId,
    //   message: message.message,
    //   timeSent: message.timeSent
    // };
    const messageCurr = message;
    messagesReturn.push(messageCurr);
    counter++;
  }
  messagesReturn.reverse();
  const returnObj : DmMessagesV1 = {
    messages: messagesReturn,
    start: start,
    end: endM,
  }
  return returnObj;
}

