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

          let messageIdCopy = data.systemInfo.messageTotal;
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
  let existOwner = 0;
  // If token is invalid
  if (!isTokenValid(token)) {
    return error;
  }

  // If length of message is over 1000 characters
  if (message.length > 1000) {
    return error;
  }

  // i need to loop through channel.messages and dm.mesages

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));

  // For editing messages in channel, loop through all the existing channels
  for (const channel of data.channels) {
    // Loop through all messages 
    for (const msg of channel.messages) {
      // If messageId exists
      if (msg.messageId === messageId) {
        existMessage = 1;
        // If message was sent by the auth user making this edit request
        if (msg.uId === authUserId) {
          existAuth = 1;
          // Loop through users
          for (user of data.users) {
            // Check if they have global owner permissions 
            if (user.uId === authuserId && user.permission === 1) {
              existOwner = 1;
            }
          }

          // Check if they are an owner of the channel
          if () {

          }

          // const editChannelMessage: MessagesObj = {
          //   messageId: messageId,
          //   uId: authUserId,
          //   message: message,
          //   timeSent: 0,
          // };
          
          // wait it is not push just replacing the message
          // ask about this 

          // I am confused about permissions so users can edit their own messages and channel owners can?
          // doesnt that contract this statement 
          // "the message was not sent by the authorised user making this request"??
          // "You should return an error if an authorised user tries to edit someone else's message, and they don't have owner permissions.

          // If the new message is an empty string, the message is deleted
          // how do i do this
          if (message.length === 0) {
            delete data.channels.messages[messageId];
          }

          setData(data);
          // return { };

        }
      }
    }
  }

  // If messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  if (existMessage === 0) {
    return error;
  }

  // If message was not sent by the authorised user making this edit request
  if (existAuth === 0) {
    return error;
  }

  // If the authorised user does not have owner permissions in the channel/DM
  // The only users with owner permissions in DMs are the original creators of each DM.
  if (existOwner === 0) {
    return error;
  }

  // implementation down below
  // the logic is to loop through the channels
  // loop through all members in selected channel
  // if member token not the same return error
  // if message ID never recgosnied return error
  // if permission Id not the same returne error
  // then can now implement
  // have new text replace old text using some sort of function
  // maybe spacer function [...array] spread opeartor
  // say if new message in parameter is an empty string, then use some form of message = null or message id = null

  return { };
}

/**
 *
 * @param token
 * @param messageId
 * @returns
 */
function messageRemoveV1 (token: string, messageId: number) {
  // error
  // if token invalid pass error
  // messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  // loop through channel.messages
  // if messageId does not equal anything then is error
  // the message was not sent by the authorised user making this request
  // if token of current auth user does not match token with the stored message or instead of token use authId
  // // the message was not sent by the authorised user making this request
  // if token of current auth user does not match token with the stored message or instead of token use authId

  // const data = getData();
  // let existDm = 0;
  // let existAuth = 0;
  // // If token is invalid
  // if (!isTokenValid(token)) {
  //   return error;
  // }

  // implementation very similart to above
  // loop channel
  // loop member
  // loop channel.message
  // find it
  // say it is now equal null
  // with the other stuff
  // asked on Edstem for removing stuff

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
      for (const member of dm.members) {
        // If the auth user is a member of DM
        if (authUserId === member.uId) {
          existAuth = 1;

          let messageIdCopy = data.systemInfo.messageTotal;
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
