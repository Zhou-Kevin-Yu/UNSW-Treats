import { getData, setData } from './dataStore.js';
import { MessagesObj } from './dataStore';

const error = { error: 'error' };

// Note: Each message should have its own unique ID,
// i.e. no messages should share an ID with another message, even if that other message is in a different channel.

// For all routes which take token as a parameter, an { error: 'error' } object should be returned when the token passed in is invalid.

// eg. authLogin
// app.post ('/auth/login/v2', (req, res, next) => {

// });

/**
 *
 * @param token
 * @param channelId
 * @param message
 * @returns
 */
function messageSendV1 (token: string, channelId: number, message: string) { // : MessageSendV1
  // // error
  // // if token invalid pass error
  // // so figure out where token is stored and do the same thing below
  // let exist_channel = 0;
  // const data = getData();
  // //If channelId is invalid
  // for (const channel of data.channels) {
  //     if (channel.channelId === channelId) {
  //         exist_channel = 1;
  //     }
  // }

  // // If the channel Id does not exist or is invalid
  // if (exist_channel === 0) {
  //     throw new Error('if the channel is not valid');
  // }

  // // length of message is less than 1 or over 1000 characters
  // // use string.length < 1 or > 1000 then return error;

  // // channelId is valid and the authorised user is not a member of the channel
  // // If the auth user is not a member of the channel
  // if (exist_auth === 0) {
  //     // return { error: 'error' };
  //     throw new Error('auth user is not a member of the channel');
  // }

  // // implementation down below
  // // the logic is to loop through the channels
  // // make sure channelId exists
  // // loop through all members in selected channel
  // // if auth user is a member
  // // push the message into messages array which is in channels array
  // // channel.messages
  // // then use some library to generate a messageId

  return token + channelId + message;
  // return messageId which is an integer
}

/**
 *
 * @param token
 * @param messageId
 * @param message
 * @returns
 */
function messageEditV1 (token: string, messageId: number, message: string) {
  // error
  // if token invalid pass error
  // so figure out where token is stored and do the same thing below
  // error length of message is over 1000 characters
  // string length
  // messageId does not refer to a valid message within a channel/DM that the authorised user has joined
  // loop through channel.messages
  // if messageId does not equal anything then is error
  // the message was not sent by the authorised user making this request
  // if token of current auth user does not match token with the stored message or instead of token use authId

  // the authorised user does not have owner permissions in the channel/DM
  // The only users with owner permissions in DMs are the original creators of each DM.
  // ^^ CHECK ON EDSTEM A BIT CONFUSING
  // WELL LOOP THRU AND CHECK IF ID EXISTS OR NOT

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

  return token + messageId + message;
  // normally returns an empty object { }
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

  // implementation very similart to above
  // loop channel
  // loop member
  // loop channel.message
  // find it
  // say it is now equal null
  // with the other stuff
  // asked on Edstem for removing stuff

  return token + messageId;
  // normally returns an empty object { }
}

/**
 *
 * @param token
 * @param dmId
 * @param message
 * @returns
 */
function messageSendDmV1 (token: string, dmId: number, message: string) {
  // error
  // if token invalid pass error
  // dmId does not refer to a valid DM
  // loop through channel member and dms (where it is stored)
  // length of message is less than 1 or over 1000 characters
  // string . length
  // dmId is valid and the authorised user is not a member of the DM
  // token not match and auth user not part of

  // implementation
  // Send a message from authorisedUser to the DM specified by dmId.
  // push dm into dm array
  // dm is array of objects with dmId and name
  // confused where dm is stored
  // basically a message
  // dm is a type of channel
  // return messageId

  return token + dmId + message;
  // return messageId which is an integer
}

export { messageSendV1, messageEditV1, messageRemoveV1, messageSendDmV1 };
