import { getData, setData } from './dataStore';
import { ChannelJoinV1, ChannelInviteV1, ChannelDetailsV1, ChannelMessagesV1 } from './dataStore';
import { MessagesObj } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import { userProfileV1 } from './users';

/*
 * ChannelJoinV1 allows an authorised user to join a valid channel if it is
 * public but if it is a private channel, only a global owner can join.

 * @param {integer} authUserId - Id of user trying to join
 * @param {integer} channelId - Id of channel that user wants to join
 * @return {} - Empty array signifying a successful join to channel
 * @returns { error : 'error' } - when channelId is invalid
 *                              - when authUserId does not exist
                                - when user is trying to join a private
                                  channelDetailsV1 but they are not a global owner
*/

function channelJoinV1(authUserId: number, channelId: number): ChannelJoinV1 {
  const data = getData();
  // If authUser is valid
  if (!(authUserId in data.users)) {
    return { error: 'error' };
  }

  let channelExists = false;
  let memberExists = false;
  // Check if user is a global owner (1 = global owner, 2 = normal user)
  const perms = data.users[authUserId].permission;

  // If channelId is invalid
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      channelExists = true;
    }
  }
  if (!channelExists) {
    return { error: 'error' };
  }

  // check if user is already a member
  for (const member of data.channels[channelId].allMembers) {
    if (authUserId === member.uId) {
      return { error: 'error' };
    }
  }

  // Check if channel is private and user is not a member
  if (!(data.channels[channelId].isPublic)) {
    for (const member of data.channels[channelId].allMembers) {
      if (authUserId === member.uId) {
        memberExists = true;
      }
    }
    // return error if they are not a member and not a global owner
    if (!memberExists && perms !== 1) {
      return { error: 'error' };
    }
  }

  // Add user to channel in allMembers array
  data.channels[channelId].allMembers.push(
    {
      uId: data.users[authUserId].uId,
      nameFirst: data.users[authUserId].nameFirst,
      nameLast: data.users[authUserId].nameLast,
      email: data.users[authUserId].email,
      handleStr: data.users[authUserId].handleStr,
    });

  setData(data);
  return {};
}

/**
 * Invites a user with ID uId to join a channel with ID channelId
 * and they immediately join
 *
 * @param {number} authUserId - authorised user that is a part of the selected channel and making the invite request
 * @param {number} channelId - id for the selected channel
 * @param {number} uId  - user to be invited
 * @returns {object} {} - empty object
 * @returns {object} {error: 'error'} - return error if channelId is invalid, uId is invalid,
 * uId refers to a user who is already a member of the channel, or channelId is valid and the authorised user is not a member of the channel
 */

function channelInviteV1(authUserId: number, channelId: number, uId: number): ChannelInviteV1 {
  const data = getData();
  // if authUser is valid
  if (!(authUserId in data.users)) {
    return { error: 'error' };
  }

  let existChannel = 0;
  let existUser = 0;
  // To loop through all the existing channels
  for (const channel of data.channels) {
    // If the channel Id exists
    if (channelId === channel.channelId) {
      // To loop through all the members in selected channel
      for (const member of channel.allMembers) {
        // If user is already a member of the channel before the invite is sent
        if (uId === member.uId) {
          return { error: 'error' };
        }
      }
    }
  }

  // Declare as empty strings
  let nameFirstCopy = '';
  let nameLastCopy = '';
  let emailCopy = '';
  let handlestrCopy = '';

  for (const user of data.users) {
    // If the user Id exists
    if (uId === user.uId) {
      existUser = 1;
      nameFirstCopy = user.nameFirst;
      nameLastCopy = user.nameLast;
      emailCopy = user.email;
      handlestrCopy = user.handleStr;
    }
  }

  // If the user Id does not exist or is invalid
  if (existUser === 0) {
    return { error: 'error' };
  }

  // To loop through all the existing channels
  for (const channel of data.channels) {
    // If the channel Id exists
    if (channelId === channel.channelId) {
      existChannel = 1;
      // To loop through all the members in selected channel
      for (const member of channel.allMembers) {
        // If the auth user is a member
        if (authUserId === member.uId) {
          // Push object user into allMembers array
          channel.allMembers.push({
            uId: uId,
            nameFirst: nameFirstCopy,
            nameLast: nameLastCopy,
            email: emailCopy,
            handleStr: handlestrCopy,
          });
          setData(data);
          return { };
        }
      }
      // If the auth user is not a member of the channel
      return { error: 'error' };
    }
  }

  // If the channel Id does not exist or is invalid
  if (existChannel === 0) {
    return { error: 'error' };
  }
}

/*
 * ChannelDetailsV1 provides the details of a valid channel if an authorised
 * user exists:

 * @param {integer} authUserId - Id of user trying to view details
 * @param {integer} channelId - Id of channel that user wants to view
 * @return {
                name:           string,
                isPublic:       boolean,
                ownerMembers:   array of user objects,
                allMembers:     array of user objects,
            }
 * @returns { error : 'error' } - when channelId is invalid
 *                              - when authUserId does not exist
                                - when user is not a member of that channel
*/

function channelDetailsV1(authUserId: number, channelId: number): ChannelDetailsV1 {
  const data = getData();
  // If authUser is valid
  if (!(authUserId in data.users)) {
    return { error: 'error' };
  }

  let exists = 0;

  // If channelId is invalid
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      exists = 1;
    }
  }

  if (exists === 0) {
    return { error: 'error' };
  }

  for (const member of data.channels[channelId].allMembers) {
    // If user if a member of the channel
    if (authUserId === member.uId) {
      return {
        name: data.channels[channelId].name,
        isPublic: data.channels[channelId].isPublic,
        ownerMembers: data.channels[channelId].ownerMembers,
        allMembers: data.channels[channelId].allMembers,
      };
    }
  }

  // If user is not a member of the channel
  return { error: 'error' };
}

/**
 * Return up to 50 messages between index "start" and "start + 50"
 * in a selected channel
 *
 * @param {number} authUserId - authorised user that is a part of the selected channel
 * @param {number} channelId - id for the selected channel
 * @param {number} start  - index of where to start returing messages
 * @returns {array of objects} messages - array of objects, where each object contains types { messageId, uId, message, timeSent }
 * @returns {number} start
 * @returns {number} end - equal to the value of "start + 50" or "-1" if no more messages to load
 */

function channelMessagesV1(authUserId: number, channelId: number, start: number): ChannelMessagesV1 {
  const data = getData();
  let existChannel = 0;
  let existAuth = 0;
  let endCopy = start + 50;
  let msgArray: MessagesObj[] = [];

  if (!(authUserId in data.users)) {
    return { error: 'error' };
  }

  // To loop through all the existing channels
  for (const channel of data.channels) {
    // If the channel Id exists
    if (channelId === channel.channelId) {
      existChannel = 1;

      // To loop through all the members in selected channel
      for (const member of channel.allMembers) {
        // If the auth user is a member
        if (authUserId === member.uId) {
          existAuth = 1;

          // Push messages into msgArray
          msgArray = channel.messages.slice(start, endCopy);

          // If function returns the last message in the channel
          // The last message in channel messages got pushed into the last element of msgArray
          if (channel.messages[endCopy - 1] === msgArray[msgArray.length - 1]) {
            endCopy = -1;
          }

          // If function returns less than 50 messages
          // Meaning that there are no more messages to return
          if (msgArray.length < 50) {
            endCopy = -1;
          }
        }
      }
      // If there were no existing messages for the selected channel
      if (channel.messages.length === 0) {
        endCopy = -1;
        msgArray = [];
        break;
      }
    }
  }

  // If the start value is greater than the total number of messages
  if (start > msgArray.length) {
    return { error: 'error' };
  }

  // If the channel Id does not exist or is invalid
  if (existChannel === 0) {
    return { error: 'error' };
  }

  // If the auth user is not a member of the channel
  if (existAuth === 0) {
    return { error: 'error' };
  }

  return {
    messages: msgArray,
    start: start,
    end: endCopy,
  };
}


export function channelAddOwnerV1(token: string, channelId: number, uId: number) {
    const data = getData();
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    const {user} = userProfileV1(authUserId, uId);
    const authUser = userProfileV1(authUserId, uId).user;
    if (authUserId === null || uId === undefined
    || data.channels[channelId] === undefined 
    || data.channels[channelId].ownerMembers.includes(user)
    || !(data.channels[channelId].allMembers.includes(user))
    || !(data.channels[channelId].ownerMembers.includes(authUser))
    ) {
        return { error: 'error' }
    }
    data.channels[channelId].ownerMembers.push(user);
    setData(data);
    return {};
}

export function channelLeaveV1(token: string, channelId: number) {
  const data = getData();
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  const authUser = userProfileV1(authUserId, authUserId).user;
  if (authUserId === null || data.channels[channelId] === undefined
  || data.channels[channelId].allMembers.includes(authUser)) {
      return { error: 'error' }
  }
  data.channels[channelId].allMembers.filter(user => user !== authUser);
  setData(data);
  return {};
}

export function channelRemoveOwnerV1(token: string, channelId: number, uId: number) {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  const authUser = userProfileV1(authUserId, authUserId).user;
  const ownerToBeRemoved = userProfileV1(authUserId, uId).user;
  const data = getData();
  if (authUserId === null || uId === undefined
    || data.channels[channelId] === undefined 
    || !(data.channels[channelId].ownerMembers.includes(ownerToBeRemoved))
    || data.channels[channelId].ownerMembers.length === 1
    || !(data.channels[channelId].ownerMembers.includes(authUser))
    ) {
        return { error: 'error' }
    }
  data.channels[channelId].ownerMembers.filter( user => user !== ownerToBeRemoved);
  setData(data);
  return {};
}


export { channelJoinV1, channelDetailsV1, channelMessagesV1, channelInviteV1 };
