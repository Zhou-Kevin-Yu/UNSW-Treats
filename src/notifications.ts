import { getData } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import { NotificationsObj, NotificationsGetV1 } from './dataStore';
import HTTPError from 'http-errors';

// Array of objects, where each object contains types { channelId, dmId, notificationMessage } where
// channelId is the id of the channel that the event happened in, and is -1 if it is being sent to a DM
// dmId is the DM that the event happened in, and is -1 if it is being sent to a channel
// notificationMessage is a string of the following format for each trigger action:
// // tagged: "{User’s handle} tagged you in {channel/DM name}: {first 20 characters of the message}"
// // reacted message: "{User’s handle} reacted to your message in {channel/DM name}"
// // added to a channel/DM: "{User’s handle} added you to {channel/DM name}"

// do i need to export interface

/**
 * Return the user's most recent 20 notifications, ordered from most recent to least recent.
 * @returns 
 */
export function notificationsGetV1 (token: string): NotificationsGetV1 {

  const data = getData();
  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, "token passed in is invalid");
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));

  

  // let notificationArray: NotificationsObj[] = [];
  // const newNotification: NotificationsObj = {
  //   channelId: ,
  //   dmId: ,
  //   notificationMessage: ,
  // };
  // 
  // notificationArray = data.notifications.push(newNotification);
  // notificationArray.reverse();
  
  // Loop to push messages into msgArray
  // for (let i = startCopy; i < endCopy; i++) {
  //   msgArray.push(channel.messages[i]);
  // }



  // use for loops and if statements
  // to locate if occured in channel id yes or not
  // to locate if occured in dm yes or not
  // tagged is the actual string
  // reacted message is actual string
  // added to a channel/dm is actual string
  // need to find channel/dm name, message string and user's handle

  return {};
  // return notificationArray;
}
