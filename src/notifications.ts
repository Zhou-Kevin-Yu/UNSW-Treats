import { getData, setData } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import { userProfileV2 } from './user';
import { NotificationsObj, /*NotificationsGetV1*/ } from './dataStore';
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
export function notificationsGetV1 (token: string)/*: NotificationsGetV1*/ {

  const data = getData();
  let notificationArray: NotificationsObj[] = [];

  // If token is invalid
  // if (!isTokenValid(token)) {
  //   throw HTTPError(403, "token passed in is invalid");
  // }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));

  for (const user of data.users) {
    //console.log('hi');
    if (user.uId === authUserId) {  
      // console.log('hi');
      notificationArray = notificationArray.concat(user.notifications);
      notificationArray.reverse();
      notificationArray = notificationArray.slice(0, 20);
    }
  }

  return notificationArray;
}
