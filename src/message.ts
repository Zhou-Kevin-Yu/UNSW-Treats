import { getData, setData } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import { MessagesObj, User } from './dataStore';
import { MessageSendV1, MessageEditV1, MessageRemoveV1, MessageSendDmV1, MessageSendlaterV1, MessageShareV1 } from './dataStore';
import { userProfileV2 } from './user';

import HTTPError from 'http-errors';

///////////// ITERATION 3 UNIQUE FUNCTIONS //////////////
function messageSearch(messageId: number) {
  let data = getData();
  let msgRtrn: MessagesObj;
  let channelIndex = -1;
  let dmIndex = -1;
  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.messageId === messageId) {
        msgRtrn = message;
        channelIndex = channel.channelId;
        break;
      }
    }
  }
  for (const dm of data.dms) {
    for (const message of dm.messages) {
      if (message.messageId === messageId) {
        msgRtrn = message;
        dmIndex = dm.dmId;
        break;
      }
    }
  }
  return {
    message: msgRtrn,
    channelIndex: channelIndex,
    dmIndex: dmIndex,
  };
}

export function messageShareV1(token: string, ogMessageId: number, message: string, channelId: number, dmId: number): MessageShareV1 {
  let data = getData();

  if (!isTokenValid(token)) {
    throw HTTPError(400, 'Invalid Token');
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token) );
  const authUser: User = userProfileV2(token, authUserId).user;

  if (!(channelId in data.channels) && !(dmId in data.dms)) {
    throw HTTPError(400, 'both channelId and dmId are invalid'); 
  }
  if (channelId !== -1 && dmId !== -1) {
    throw HTTPError(400, 'neither channelId nor dmId are -1'); 
  }

  let messageInfo = messageSearch(ogMessageId);

  if (messageInfo.channelIndex === -1 && messageInfo.dmIndex === -1) {
    throw HTTPError(400, 'message of messageId: ogMessageId does not exist in data');
  }

  //check if user is in channel
  if (messageInfo.channelIndex !== -1) {
    if (!(data.channels[messageInfo.channelIndex].allMembers.includes(authUser))) {
      throw HTTPError(400, 'ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined');
    }
  }
  //check if user is in dm
  if (messageInfo.dmIndex !== -1) {
    if (!(data.dms[messageInfo.dmIndex].members.includes(authUserId))) {
      throw HTTPError(400, 'ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined');
    }
  }

  const newMsg = messageInfo.message.message.concat('\n\n', message)

  if (newMsg.length > 1000) {
    throw HTTPError(403, 'message Length > 1000');
  }

  if (channelId !== -1 && dmId === -1) {
    messageSendV1(token, channelId, newMsg);
  } else {
    throw HTTPError(400, 'something went wrong, this error should not be thrown');
  }

  if (dmId !== -1 && channelId === -1) {
    messageSendDmV1(token, dmId, newMsg);
  } else {
    throw HTTPError(400, 'something went wrong, this error should not be thrown');
  }


  return { sharedMessageId: -1 };
}

export function messageReactV1(token: string, messageId: number, reactId: number) {
  return {};
}

export function messageUnreactV1(token: string, messageId: number, reactId: number) {
  return {};
}

export function messagePinV1(token: string, messageId: number) {
  return {};
}

export function messageUnpinV1(token: string, messageId: number) {
  return {};
}

export function messageSendlaterV1(token: string, channelId: number, message: string, timeSent: number): MessageSendlaterV1 {
  return { messageId: -1 };
}

export function messageSendlaterDmV1(token: string, dmId: number, message: string, timeSent: number): MessageSendlaterV1 {
  return { messageId: -1 };
}




///////////// ITERATION 2,1 UNIQUE FUNCTIONS //////////////
/**
 * Send a message from the authorised user to the channel specified by channelId
 *
 * @param {string} token - user login token
 * @param {number} channelId - id for the selected channel
 * @param {string} message - actual message string
 * @returns {object} object containing messageId - a unique number as each message should have its own unique ID,
 * @returns {object} { error: 'error' } - return error if channelId is invalid, length of message is less than 1
 * or over 1000 characters, or channelId is valid and the authorised user is not a member of the channel
 */
export function messageSendV1 (token: string, channelId: number, message: string): MessageSendV1 {
  const data = getData();
  let existChannel = 0;
  let existAuth = 0;
  let messageIdCopy = 0;

  // If token is invalid
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }

  // If length of message is less than 1 or over 1000 characters
  if (message.length < 1 || message.length > 1000) {
    return { error: 'error' };
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));

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

          messageIdCopy = data.systemInfo.messageTotal;
          data.systemInfo.messageTotal++;
          const newChannelMessage: MessagesObj = {
            messageId: messageIdCopy,
            uId: authUserId,
            message: message,
            timeSent: Math.floor((new Date()).getTime() / 1000),
          };
          channel.messages.push(newChannelMessage);
          setData(data);
          return { messageId: messageIdCopy };
        }
      }
    }
  }

  // If the channel Id does not exist or is invalid
  if (existChannel === 0) {
    return { error: 'error' };
  }

  // If channelId is valid and the authorised user is not a member of the channel
  if (existAuth === 0) {
    return { error: 'error' };
  }
}

/**
 * Given a message, update its text with new text. If the new message is an empty string, the message is deleted.
 * @param {string} token - user login token
 * @param {number} messageId - id for the selected message
 * @param {string} message - actual message string
 * @returns {object} {} - empty object
 * @returns {object} { error: 'error' } - return error if length of message is over 1000 characters,
 * messageId does not refer to a valid message within a channel/DM that the authorised user has joined,
 * the message was not sent by the authorised user making this request,
 * or the authorised user does not have owner permissions in the channel/DM
 */
export function messageEditV1 (token: string, messageId: number, message: string): MessageEditV1 {
  const data = getData();
  let existMessage = 0;
  let existAuth = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }

  if (messageId === null || messageId === undefined) {
    return { error: 'error' };
  }

  // If length of message is over 1000 characters
  if (message.length > 1000) {
    return { error: 'error' };
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  let isGlobalOwner = false;
  let isChannelOwner = false;
  let isDmOwner = false;

  // If the auth user is a global owner of Treat
  for (const user of data.users) {
    if (authUserId === user.uId) {
      // If auth user has owner permissions
      if (user.permission === 1) {
        isGlobalOwner = true;
      }
    }
  }

  // If the auth user is the owner of the channel
  for (const channel of data.channels) {
    // Loop through all messages in channel
    for (const msg of channel.messages) {
      // Check that the message is not undefined or null
      if (msg !== undefined || msg !== null) {
        // If messageId exists
        if (msg.messageId === messageId) {
          existMessage = 1;
          // Loop through all members in ownerMembers
          for (const ownerMember of channel.ownerMembers) {
            // If auth user is in ownerMembers
            if (authUserId === ownerMember.uId) {
              isChannelOwner = true;
            }
          }
        }
      }
    }
  }

  // If the auth user is the original creator of the DM
  for (const dm of data.dms) {
    // Check that the DM is not undefined or null
    if (dm !== undefined || dm !== null) {
      // Loop through messages in DMs
      for (const dmMsg of dm.messages) {
        // Check the the DM message is not undefined or null
        if (dmMsg !== undefined || dmMsg !== null) {
          // If message Id exists
          if (dmMsg.messageId === messageId) {
            existMessage = 1;
            // If auth user is the creator of the DM
            if (authUserId === dm.creator) {
              isDmOwner = true;
            }
          }
        }
      }
    }
  }

  let counter = 0;
  // Auth user trying to edit a message sent in a channel
  // Loop through all existing channels
  for (const channel of data.channels) {
    // Loop through all messages
    for (const msg of channel.messages) {
      // Check that the message is not undefined or null
      if (msg !== undefined || msg !== null) {
        // If messageId exists
        if (msg.messageId === messageId) {
          existMessage = 1;
          // If message was sent by the auth user making this edit request or is a global/channel owner
          if (msg.uId === authUserId || isGlobalOwner === true || isChannelOwner === true) {
            existAuth = 1;
            // Access message string and update string with new message
            msg.message = message;
            // If the new message is an empty string, the message is deleted
            if (message.length === 0) {
              const msgToRemove = data.channels[counter].messages.indexOf(msg);
              data.channels[counter].messages.splice(msgToRemove, 1);
            }
            setData(data);
            return {};
          }
        }
      }
    }
    counter++;
  }

  // Auth user trying to edit a message sent in a DM
  // Loop through all existing DMs
  for (const dm of data.dms) {
    // Check that the DM is not undefined or null
    if (dm !== undefined || dm !== null) {
      // Loop through messages in DMs
      for (const dmMsg of dm.messages) {
        // Check that the DM message is not undefined or null
        if (dmMsg !== undefined || dmMsg !== null) {
          // If messageId exists
          if (dmMsg.messageId === messageId) {
            existMessage = 1;
            // If message was sent by the auth user making this edit request or is a DM owner
            if (dmMsg.uId === authUserId || isDmOwner === true) {
              existAuth = 1;
              // Access message string and update string with new message
              dmMsg.message = message;
              // if (message !== '') {
              // } else {
              //   delete dmMsg.message;
              // }

              // If the new message is an empty string, the message is deleted
              if (message.length === 0) {
                const dmIndex = data.dms.indexOf(dm);
                const msgToRemove = data.dms[dmIndex].messages.indexOf(dmMsg);
                data.dms[dmIndex].messages.splice(msgToRemove, 1);
              }
              setData(data);
              return { };
            }
          }
        }
      }
    }
  }

  // If message was not sent by the authorised user making this edit request
  if (existAuth === 0) {
    return { error: 'error' };
  }

  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  if (existMessage === 0) {
    return { error: 'error' };
  }
}

/**
 * Given a messageId for a message, this message is removed from the channel/DM
 * @param {string} token - user login token
 * @param {number} messageId - id for the selected message
 * @returns {object} {} - empty object
 * @returns {object} { error: 'error' } - return error if messageId does not refer to a valid message within a channel/DM
 * that the authorised user has joined,
 * the message was not sent by the authorised user making this request,
 * or the authorised user does not have owner permissions in the channel/DM
 */
export function messageRemoveV1 (token: string, messageId: number): MessageRemoveV1 {
  const data = getData();
  let existMessage = 0;
  let existAuth = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }

  if (messageId === null || messageId === undefined) {
    return { error: 'error' };
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  let isGlobalOwner = false;
  let isChannelOwner = false;
  let isDmOwner = false;

  // If the auth user is a global owner of Treat
  for (const user of data.users) {
    if (authUserId === user.uId) {
      // If auth user has owner permissions
      if (user.permission === 1) {
        isGlobalOwner = true;
      }
    }
  }

  // If the auth user is the owner of the channel
  for (const channel of data.channels) {
    // Loop through all messages in channel
    for (const msg of channel.messages) {
      // Check that the message is not undefined or null
      if (msg !== undefined || msg !== null) {
        // If messageId exists
        if (msg.messageId === messageId) {
          existMessage = 1;
          // Loop through all members in ownerMembers
          for (const ownerMember of channel.ownerMembers) {
            // If auth user is in ownerMembers
            if (authUserId === ownerMember.uId) {
              isChannelOwner = true;
            }
          }
        }
      }
    }
  }

  // If the auth user is the original creator of the DM
  for (const dm of data.dms) {
    // Check that the DM is not undefined or null
    if (dm !== undefined || dm !== null) {
      // Loop through messages in DMs
      for (const dmMsg of dm.messages) {
        // Check that the DM message is not undefined or null
        if (dmMsg !== undefined || dmMsg !== null) {
          // If message Id exists
          if (dmMsg.messageId === messageId) {
            existMessage = 1;
            // If auth user is the creator of the DM
            if (authUserId === dm.creator) {
              isDmOwner = true;
            }
          }
        }
      }
    }
  }

  let counter = 0;
  // Auth user trying to remove a message sent in a channel
  // Loop through all existing channels
  for (const channel of data.channels) {
    // Loop through all messages
    for (const msg of channel.messages) {
      // Check that the message is not undefined or null
      if (msg !== undefined || msg !== null) {
        // If messageId exists
        if (msg.messageId === messageId) {
          existMessage = 1;
          // If message was sent by the auth user making this remove request or is a global/channel owner
          if (msg.uId === authUserId || isGlobalOwner === true || isChannelOwner === true) {
            existAuth = 1;
            // Loop to find message and delete it from selected channel
            const msgToRemove = data.channels[counter].messages.indexOf(msg);
            data.channels[counter].messages.splice(msgToRemove, 1);
            // for (let i = 0; i < messageId; i++) {
            //   delete data.channels[counter].messages[i];
            // }
            setData(data);
            return { };
          }
        }
      }
    }
    counter++;
  }

  // Auth user trying to edit a message sent in a DM
  // Loop through all existing DMs
  for (const dm of data.dms) {
    // Check that the DM is not undefined or null
    if (dm !== undefined || dm !== null) {
      // Loop through messages in DMs
      for (const dmMsg of dm.messages) {
        // Check that the message is not undefined or null
        if (dmMsg !== undefined || dmMsg !== null) {
          // If messageId exists
          if (dmMsg.messageId === messageId) {
            existMessage = 1;
            // If message was sent by the auth user making this edit request or is a DM owner
            if (dmMsg.uId === authUserId || isDmOwner === true) {
              existAuth = 1;

              // Loop to find message and delete it from selected DM
              const dmIndex = data.dms.indexOf(dm);
              const msgToRemove = data.dms[dmIndex].messages.indexOf(dmMsg);
              data.dms[dmIndex].messages.splice(msgToRemove, 1);

              // for (let i = 0; i < messageId; i++) {
              //   delete data.dms[i].messages;
              // }

              setData(data);
              return { };
            }
          }
        }
      }
    }
  }

  // If message was not sent by the authorised user making this edit request
  if (existAuth === 0) {
    return { error: 'error' };
  }

  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  if (existMessage === 0) {
    return { error: 'error' };
  }
}

/**
* Send a message from authorisedUser to the DM specified by dmId.
* @param {string} token - user login token
* @param {number} dmId - id for the selected DM
* @param {string} message - actual message string
* @returns {object} object containing messageId - a unique number as each message should have its own unique ID,
* @returns {object} { error: 'error' } - return error if mdmId does not refer to a valid DM,
* length of message is less than 1 or over 1000 characters,
* or dmId is valid and the authorised user is not a member of the DM
*/
export function messageSendDmV1 (token: string, dmId: number, message: string): MessageSendDmV1 {
  const data = getData();
  let existDm = 0;
  let existAuth = 0;
  let messageIdCopy = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }

  // If length of message is less than 1 or over 1000 characters
  if (message.length < 1 || message.length > 1000) {
    return { error: 'error' };
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));

  // To loop through all the existing DMs
  for (const dm of data.dms) {
    // Check that the DM is not undefined or null
    if (dm !== undefined || dm !== null) {
      // If the dmId exists
      if (dmId === dm.dmId) {
        existDm = 1;
        // To loop through all the members in selected DM
        // for (const member of dm.members) {
        for (let i = 0; i < dm.members.length; i++) {
          // If the auth user is a member of DM
          if (dm.members[i] === authUserId) {
            existAuth = 1;

            messageIdCopy = data.systemInfo.messageTotal;
            data.systemInfo.messageTotal++;

            const newDmMessage: MessagesObj = {
              messageId: messageIdCopy,
              uId: authUserId,
              message: message,
              timeSent: Math.floor((new Date()).getTime() / 1000),
            };
            dm.messages.push(newDmMessage);
            setData(data);
          }
        }
      }
    }
  }

  // If the dmId does not exist or is invalid
  if (existDm === 0) {
    return { error: 'error' };
  }

  // If dmId is valid and the authorised user is not a member of the DM
  if (existAuth === 0) {
    return { error: 'error' };
  }

  return { messageId: messageIdCopy };
}
