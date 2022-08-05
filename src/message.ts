import { getData, setData } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import { MessagesObj, User } from './dataStore';
import { NotificationsObj } from './dataStore';
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

  //check if user is in channel where message exists

  if (messageInfo.channelIndex !== -1) {
    let channelFound = false;
    for (const user of data.channels[messageInfo.channelIndex].allMembers) {
      if (user.uId === authUserId) {
        channelFound = true;
        break;
      }
    }
    if (!channelFound) {
      throw HTTPError(400, 'ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined');
    }
    // if (!(data.channels[messageInfo.channelIndex].allMembers.includes(authUser))) {
    //   console.log("====================");
    //   throw HTTPError(400, 'ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined');
    // }
  }
  //check if user is in dm
  if (messageInfo.dmIndex !== -1) {
    if (!(data.dms[messageInfo.dmIndex].members.includes(authUserId))) {
      throw HTTPError(400, 'ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined');
    }
  }

  if (channelId !== -1) {
    let channelFound = false;
    for (const user of data.channels[channelId].allMembers) {
      if (user.uId === authUserId) {
        channelFound = true;
        break;
      }
    }
    if (!channelFound) {
      throw HTTPError(403, 'the pair of channelId and dmId are valid (i.e. one is -1, the other is valid) and the authorised user has not joined the channel or DM they are trying to share the message to');
    }
  }

  if (dmId !== -1) {
    if (!(data.dms[dmId].members.includes(authUserId))) {
      throw HTTPError(403, 'the pair of channelId and dmId are valid (i.e. one is -1, the other is valid) and the authorised user has not joined the channel or DM they are trying to share the message to');
    }
  }

  const newMsg = messageInfo.message.message.concat('\n\n', message)

  if (newMsg.length > 1000) {
    throw HTTPError(403, 'message Length > 1000');
  }

  let newMsgId = -1;

  if (channelId !== -1 && dmId === -1) {
    newMsgId = messageSendV1(token, channelId, newMsg).messageId;
  }

  if (dmId !== -1 && channelId === -1) {
    newMsgId = messageSendDmV1(token, dmId, newMsg).messageId;
  }

  setData(data);

  return { sharedMessageId: newMsgId };
}

export function messageReactV1(token: string, messageId: number, reactId: number) {
  
  const authUserId = tokenToAuthUserId(token, isTokenValid(token) );
  messageReactNotifV1 (reactId, authUserId, messageId);
  
  return {};
}

export function messageReactNotifV1 (reactId: number, authUserId: number, messageId: number) {
  
  const data = getData();
  
  let authUserHandle = '';
  for (const user of data.users) {
    if (authUserId === user.uId) {
      authUserHandle = user.handleStr;
    }
  }
  
  // let channelName = '';
  let dmName = '';
  // let channelIdCopy = -1;
  let dmIdCopy = -1;
  let userId = -1;

  // // Find message in channel
  // for (const channel of data.channels) {
  //   for (const message of channel.messages) {
  //     if (message.messageId === messageId) {
  //       channelName = channel.name;
  //       channelIdCopy = channel.channelId;
  //       userId = message.uId;
  //     }
  //   }
  // }

  // Find message in DM
  for (const dm of data.dms) {
    for (const message of dm.messages) {
      if (message.messageId === messageId) {
        dmName = dm.name;
        dmIdCopy = dm.dmId;
        userId = message.uId;
      }
    }
  }

  // // React to channel message
  // for (const user of data.users) {
  //   if (userId === user.uId) {
  //     const newNotification: NotificationsObj = {
  //       channelId: channelIdCopy,
  //       dmId: -1,
  //       notificationMessage: `@${authUserHandle} reacted to your message in ${channelName}`,
  //     };
  //     user.notifications.push(newNotification);
  //     setData(data);
  //   }
  // }

  // React to DM message
  for (const user of data.users) {
    if (userId === user.uId) {
      const newNotification: NotificationsObj = {
        channelId: -1,
        dmId: dmIdCopy,
        notificationMessage: `@${authUserHandle} reacted to your message in ${dmName}`,
      };
      user.notifications.push(newNotification);
      setData(data);
    }
  }
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
  let messageIdCopy = 0;

  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, "token passed in is invalid");
  }

  // If length of message is less than 1 or over 1000 characters
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, "length of message is less than 1 or over 1000 characters");
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  const existChannel = data.channels.find(element => element.channelId === channelId);
  const channelIndex = data.channels.findIndex(element => element.channelId === channelId);
  // If the channel Id does not exist or is invalid
  if (existChannel === undefined) {
    throw HTTPError(400, "channelId does not refer to a valid channel");
  }

  const existAuth = data.channels[channelIndex].allMembers.find(member => member.uId === authUserId);
  // If channelId is valid and the authorised user is not a member of the channel
  if (existAuth === undefined) {
    throw HTTPError(403, "channelId is valid and the authorised user is not a member of the channel");
  }

  // To loop through all the existing channels
  for (const channel of data.channels) {
    // Find the channel Id 
    if (channelId === channel.channelId) {
      // To loop through all the members in selected channel
      let channelName = channel.name;

      for (const member of channel.allMembers) {
        
        // If the auth user is a member
        if (authUserId === member.uId) {
          messageIdCopy = data.systemInfo.messageTotal;
          data.systemInfo.messageTotal++;
          const newChannelMessage: MessagesObj = {
            messageId: messageIdCopy,
            uId: authUserId,
            message: message,
            timeSent: Math.floor((new Date()).getTime() / 1000),
            reacts: [],
            isPinned: false,
          };
          //
          messageSendTaggedV1(channelId, channelName, authUserId, message);
          //
          channel.messages.push(newChannelMessage);
          setData(data);
          return { messageId: messageIdCopy };
        }
      }
    }
  }
}

export function messageSendTaggedV1 (channelId: number, channelName: string, authUserId: number, message: string) {
  
  const data = getData();
  
  let authUserHandle = '';
  for (const user of data.users) {
    if (authUserId === user.uId) {
      authUserHandle = user.handleStr;
    }
  }

  for (const user of data.users) {
    if (message.includes(`@${user.handleStr}`) === true) {
      if (data.channels[channelId].allMembers.includes(user) === true) {
        const newNotification: NotificationsObj = {
          channelId: channelId,
          dmId: -1,
          notificationMessage: `@${authUserHandle} tagged you in ${channelName}: ${message.substring(0,20)}`,
        };
        user.notifications.push(newNotification);
        setData(data);
      }
    }
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
  let existMessage = false;
  let existAuth = false;
  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, "token passed in is invalid");
  }

  // If messageId is invalid
  if (messageId === null || messageId === undefined) {
    throw HTTPError(400, "messageId is null or undefined");
  }

  // If length of message is over 1000 characters
  if (message.length > 1000) {
    throw HTTPError(400, "length of message is over 1000 characters");
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  let isGlobalOwner = false;
  let isChannelOwner = false;
  let isDmOwner = false;
  
  // let existMessage = undefined;
  // for (let i = 0; i < data.channels.length; i++) {
  //   const existMessage = data.channels[i].messages.find(element => element.messageId === messageId);
  //   if (existMessage !== undefined) {
  //     break
  //   }
  // }
  // const existMessage = data.channels[i].messages.find(element => element.messageId === messageId);
  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  // if (existMessage === undefined) {
  //   return { error: 'error' };
  // }
  
  // If the auth user is a global owner of Treat
  // if (data.users.find(element => element.uId === authUserId) !== undefined) {
  //   if () { 
  //     isGlobalOwner = true;
  //   }
  // }
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
          existMessage = true;
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
            existMessage = true;
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
          existMessage = true;
          // If message was sent by the auth user making this edit request or is a global/channel owner
          if (msg.uId === authUserId || isGlobalOwner === true || isChannelOwner === true) {
            existAuth = true;
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
            existMessage = true;
            // If message was sent by the auth user making this edit request or is a DM owner
            if (dmMsg.uId === authUserId || isDmOwner === true) {
              existAuth = true;
              // Access message string and update string with new message
              dmMsg.message = message;

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
  
  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  if (existMessage === false) {
    throw HTTPError(400, "messageId does not refer to a valid message within a channel/DM that the authorised user has joined");
  }

  // If message was not sent by the authorised user making this edit request
  if (existAuth === false) {
    throw HTTPError(403, "message was not sent by the authorised user making this edit request");
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
 export function messageEditV3(token: string, messageId: number, message: string): MessageEditV1 {
  const data = getData();
  let existMessage = 0;
  let existAuth = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Invalid token');
  }

  if (messageId === null || messageId === undefined) {
    throw HTTPError(400, 'Invalid messageId');
  }

  // If length of message is over 1000 characters
  if (message.length > 1000) {
    throw HTTPError(400, 'Message is too long');
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
    throw HTTPError(403, 'You do not have permission to edit this message');
  }

  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  if (existMessage === 0) {
    throw HTTPError(400, "messageId does not refer to a valid message within a channel/DM that the authorised user has joined");
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
  let existMessage = false;
  let existAuth = false;
  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, "token passed in is invalid");
  }

  if (messageId === null || messageId === undefined) {
    throw HTTPError(400, "messageId is null or undefined");
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
          existMessage = true;
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
            existMessage = true;
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
          existMessage = true;
          // If message was sent by the auth user making this remove request or is a global/channel owner
          if (msg.uId === authUserId || isGlobalOwner === true || isChannelOwner === true) {
            existAuth = true;
            // Find message and delete it from selected channel
            const msgToRemove = data.channels[counter].messages.indexOf(msg);
            data.channels[counter].messages.splice(msgToRemove, 1);
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
            existMessage = true;
            // If message was sent by the auth user making this edit request or is a DM owner
            if (dmMsg.uId === authUserId || isDmOwner === true) {
              existAuth = true;

              // Find message and delete it from selected DM
              const dmIndex = data.dms.indexOf(dm);
              const msgToRemove = data.dms[dmIndex].messages.indexOf(dmMsg);
              data.dms[dmIndex].messages.splice(msgToRemove, 1);

              setData(data);
              return { };
            }
          }
        }
      }
    }
  }

  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  if (existMessage === false) {
    throw HTTPError(400, "messageId does not refer to a valid message within a channel/DM that the authorised user has joined");
  }

  // If message was not sent by the authorised user making this edit request
  if (existAuth === false) {
    throw HTTPError(403, "message was not sent by the authorised user making this edit request");
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
 export function messageRemoveV3 (token: string, messageId: number): MessageRemoveV1 {
  const data = getData();
  let existMessage = 0;
  let existAuth = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'token is invalid');
  }

  if (messageId === null || messageId === undefined) {
    throw HTTPError(400, 'messageId is invalid');
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
    throw HTTPError(403, "message was not sent by the authorised user making this edit request");
  }

  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  if (existMessage === 0) {
    throw HTTPError(400, "messageId does not refer to a valid message within a channel/DM that the authorised user has joined");
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
  let messageIdCopy = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, "token passed in is invalid");
  }

  // If length of message is less than 1 or over 1000 characters
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, "length of message is less than 1 or over 1000 characters");
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  const existDm = data.dms.find(element => element.dmId === dmId);
  const dmIndex = data.dms.findIndex(element => element.dmId === dmId);
  // If the dmId does not exist or is invalid
  if (existDm === undefined) {
    throw HTTPError(400, "dmId does not refer to a valid DM");
  }
  
  const existAuth = data.dms[dmIndex].members.find(member => member === authUserId);
  // If dmId is valid and the authorised user is not a member of the DM
  if (existAuth === undefined) {
    throw HTTPError(403, "dmId is valid and the authorised user is not a member of the DM");
  }

  // To loop through all the existing DMs
  for (const dm of data.dms) {
    // Check that the DM is not undefined or null
    if (dm !== undefined || dm !== null) {
      // Find the DM
      if (dmId === dm.dmId) {
        let dmName = dm.name;

        // To loop through all the members in selected DM
        for (let i = 0; i < dm.members.length; i++) {
          // If the auth user is a member of DM
          if (dm.members[i] === authUserId) {
            messageIdCopy = data.systemInfo.messageTotal;
            data.systemInfo.messageTotal++;

            const newDmMessage: MessagesObj = {
              messageId: messageIdCopy,
              uId: authUserId,
              message: message,
              timeSent: Math.floor((new Date()).getTime() / 1000),
              reacts: [],
              isPinned: false,
            };
            //
            messageSendDmTaggedV1(dmId, dmName, authUserId, message);
            // 
            dm.messages.push(newDmMessage);
            setData(data);
          }
        }
      }
    }
  }

  return { messageId: messageIdCopy };
}

export function messageSendDmTaggedV1 (dmId: number, dmName: string, authUserId: number, message: string) {
  
  const data = getData();
  
  let authUserHandle = '';
  for (const user of data.users) {
    if (authUserId === user.uId) {
      authUserHandle = user.handleStr;
    }
  }

  for (const user of data.users) {
    if (message.includes(`@${user.handleStr}`) === true) {
      if (data.dms[dmId].members.includes(user.uId) === true) {
        const newNotification: NotificationsObj = {
          channelId: -1,
          dmId: dmId,
          notificationMessage: `@${authUserHandle} tagged you in ${dmName}: ${message.substring(0,20)}`,
        };

        user.notifications.push(newNotification);
        setData(data);
      }
    }
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
export function messageSendDmV3 (token: string, dmId: number, message: string): MessageSendDmV1 {
  const data = getData();
  let existDm = 0;
  let existAuth = 0;
  let messageIdCopy = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, "token is invalid");
  }

  // If length of message is less than 1 or over 1000 characters
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, "length of message is less than 1 or over 1000 characters");
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
              reacts: [],
              isPinned: false,
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
    throw HTTPError(400, "dmId does not refer to a valid DM");
  }

  // If dmId is valid and the authorised user is not a member of the DM
  if (existAuth === 0) {
    throw HTTPError(403, "authorised user is not a member of the DM");
  }

  return { messageId: messageIdCopy };
}

export function messageSendV2 (token: string, channelId: number, message: string): MessageSendV1 {
  const data = getData();
  let existChannel = 0;
  let existAuth = 0;
  let messageIdCopy = 0;

  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, "Access Denied: Token is invalid");
  }

  // If length of message is less than 1 or over 1000 characters
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, "Message is too long or too short");
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
            reacts: [],
            isPinned: false,
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
    throw HTTPError(400, "channelId does not refer to a valid channel");
  }

  // If channelId is valid and the authorised user is not a member of the channel
  if (existAuth === 0) {
    throw HTTPError(403, "Access Denied: User is not a member of the channel");
  }
}

export function messageSendInsideStandup (token: string, channelId: number, message: string): MessageSendV1 {
  const data = getData();
  let existChannel = 0;
  let existAuth = 0;
  let messageIdCopy = 0;

  // If token is invalid
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }

  // // If length of message is less than 1 or over 1000 characters
  // if (message.length < 1 || message.length > 1000) {
  //   return { error: 'error' };
  // }

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
            reacts: [],
            isPinned: false,
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
