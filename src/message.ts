import { getData, setData } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import { MessagesObj } from './dataStore';

const error = { error: 'error' };

/**
 *
 * @param token
 * @param channelId
 * @param message
 * @returns
 */
function messageSendV1 (token: string, channelId: number, message: string) { // : MessageSendV1
  const data = getData();
  let existChannel = 0;
  let existAuth = 0;
  let messageIdCopy = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    return error;
  }

  // If length of message is less than 1 or over 1000 characters
  if (message.length < 1 || message.length > 1000) {
    return error;
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
            timeSent: 0,
          };
          channel.messages.push(newChannelMessage);
          setData(data);
        }
      }
    }
  }

  // If the channel Id does not exist or is invalid
  if (existChannel === 0) {
    return error;
  }

  // If channelId is valid and the authorised user is not a member of the channel
  if (existAuth === 0) {
    return error;
  }

  return messageIdCopy;
}

/**
 *
 * @param token
 * @param messageId
 * @param message
 * @returns
 */
function messageEditV1 (token: string, messageId: number, message: string) {

  const data = getData();
  let existMessage = 0;
  let existAuth = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    return error;
  }

  // If length of message is over 1000 characters
  if (message.length > 1000) {
    return error;
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

  // If the auth user is the original creator of the DM
  for (const dm of data.dms) {
    // Loop through messages in DMs
    for (const dmMsg of dm.messages) {
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
  
  // Auth user trying to edit a message sent in a channel
  // Loop through all existing channels
  for (const channel of data.channels) {
    // Loop through all messages
    for (const msg of channel.messages) {
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
            for (let i = 0; i < messageId; i++) {
              // delete data.channels.messages[i];
              delete data.channels.MessagesObj[i];
            }
          }
          setData(data);
          return { };
        }
      }
    }
  }

  // Auth user trying to edit a message sent in a DM
  // Loop through all existing DMs
  for (const dm of data.dms) {
    // Loop through messages in DMs
    for (const dmMsg of dm.messages) {
      // If messageId exists
      if (dmMsg.messageId === messageId) {
        existMessage = 1;
        // If message was sent by the auth user making this edit request or is a DM owner
        if (dmMsg.uId === authUserId || isDmOwner === true) {
          existAuth = 1;
          // Access message string and update string with new message
          dmMsg.message = message;

          // If the new message is an empty string, the message is deleted
          if (message.length === 0) {
            for (let i = 0; i < messageId; i++) {
              delete data.dms.messages[i];
            } 
          }
          setData(data);
          return { };
        }
      }
    }
  }

  // If message was not sent by the authorised user making this edit request
  if (existAuth === 0) {
    return error;
  }

  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  if (existMessage === 0) {
    return error;
  }
}

/**
 *
 * @param token
 * @param messageId
 * @returns
 */
function messageRemoveV1 (token: string, messageId: number) {
  
  const data = getData();
  let existMessage = 0;
  let existAuth = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    return error;
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

  // If the auth user is the original creator of the DM
  for (const dm of data.dms) {
    // Loop through messages in DMs
    for (const dmMsg of dm.messages) {
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
  
  // Auth user trying to remove a message sent in a channel
  // Loop through all existing channels
  for (const channel of data.channels) {
    // Loop through all messages
    for (const msg of channel.messages) {
      // If messageId exists
      if (msg.messageId === messageId) {
        existMessage = 1;
        // If message was sent by the auth user making this remove request or is a global/channel owner
        if (msg.uId === authUserId || isGlobalOwner === true || isChannelOwner === true) {
          existAuth = 1;
          // Loop to find message and delete it from selected channel
          for (let i = 0; i < messageId; i++) {
            // delete data.channels.messages[i];
            delete data.channels.MessagesObj[i];
          }
          setData(data);
          return { };
        }
      }
    }
  }

  // Auth user trying to edit a message sent in a DM
  // Loop through all existing DMs
  for (const dm of data.dms) {
    // Loop through messages in DMs
    for (const dmMsg of dm.messages) {
      // If messageId exists
      if (dmMsg.messageId === messageId) {
        existMessage = 1;
        // If message was sent by the auth user making this edit request or is a DM owner
        if (dmMsg.uId === authUserId || isDmOwner === true) {
          existAuth = 1;
          
          // Loop to find message and delete it from selected DM
          for (let i = 0; i < messageId; i++) {
            delete data.dms.messages[i];
          } 
          
          setData(data);
          return { };
        }
      }
    }
  }

  // If message was not sent by the authorised user making this edit request
  if (existAuth === 0) {
    return error;
  }

  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  if (existMessage === 0) {
    return error;
  }
}

/**
 *
 * @param token
 * @param dmId
 * @param message
 * @returns
 */
function messageSendDmV1 (token: string, dmId: number, message: string) {
  const data = getData();
  let existDm = 0;
  let existAuth = 0;
  let messageIdCopy = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    return error;
  }

  // If length of message is less than 1 or over 1000 characters
  if (message.length < 1 || message.length > 1000) {
    return error;
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));

  // To loop through all the existing DMs
  for (const dm of data.dms) {
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
            timeSent: 0,
          };
          dm.messages.push(newDmMessage);
          setData(data);
        }
      }
    }
  }

  // If the dmId does not exist or is invalid
  if (existDm === 0) {
    return error;
  }

  // If dmId is valid and the authorised user is not a member of the DM
  if (existAuth === 0) {
    return error;
  }

  return messageIdCopy;
}

export { messageSendV1, messageEditV1, messageRemoveV1, messageSendDmV1 };
