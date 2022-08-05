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
  // let channelIdCopy = -1;
  // let dmIdCopy = -1;
  // let notificationMsgCopy = '';
  let notificationArray: NotificationsObj[] = [];
  // // let index = 0; 

  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, "token passed in is invalid");
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  
  // const newNotification: NotificationsObj = {
  //   channelId: channelIdCopy,
  //   dmId: dmIdCopy,
  //   notificationMessage: notificationMsgCopy,
  // };

  // // Loop through reacted message in channels
  // for (const channel of data.channels) {
  //   for (const message of channel.messages) {
      
  //     // Fix this below
  //     const userHandle = userProfileV2(token, message.uId).user.handleStr;

  //     // do i need to do message.reacts[].reactId === 1
  //     if (message.reacts != null) {
  //       channelIdCopy = channel.channelId;
  //       notificationMsgCopy = `${userHandle} reacted to your message in ${channel.name}`;
        
  //       // data.notifications[index].push(newNotification);
  //       data.notifications.push(newNotification);
  //       setData(data);
  //       // index++;
  //     }
  //   }
  // }

  // // Loop through reacted message in DMs
  // for (const dm of data.dms) {
  //   for (const message of dm.messages) {
      
  //     // Fix this below
  //     const userHandle = userProfileV2(token, message.uId).user.handleStr;

  //     // do i need to do message.reacts[].reactId === 1
  //     if (message.reacts != null) {
  //       dmIdCopy = dm.dmId;
  //       notificationMsgCopy = `${userHandle} reacted to your message in ${dm.name}`;

  //       // data.notifications[index].push(newNotification);
  //       data.notifications.push(newNotification);
  //       setData(data);
  //       // index++;
  //     }
  //   }
  // }

  // // Loop through tagged message in channels
  

  // // Loop through tagged message in DMs

  // // Need to implement added to channel and added to DM

  // // const newNotification: NotificationsObj = {
  // //   channelId: channelIdCopy,
  // //   dmId: dmIdCopy,
  // //   notificationMessage: notificationMsgCopy,
  // // };

  // // data.notifications[0].push(newNotification);
  // // notificationArray = data.notifications[].push(newNotification);
  for (const user of data.users) {
    if (user.uId === authUserId) {  
      // notificationArray = user.notifications.reverse();
      // notificationArray.reverse(user.notifications);
      notificationArray = notificationArray.concat(user.notifications);
      notificationArray.reverse();
      notificationArray = notificationArray.slice(0, 20);
    }
  }
  // // setData(data);
  // // notificationArray.reverse();
  
  // // Loop to push messages into msgArray
  // // for (let i = startCopy; i < endCopy; i++) {
  // //   msgArray.push(channel.messages[i]);
  // // }



  // // use for loops and if statements
  // // to locate if occured in channel id yes or not
  // // to locate if occured in dm yes or not
  // // tagged is the actual string
  // // reacted message is actual string
  // // added to a channel/dm is actual string
  // // need to find channel/dm name, message string and user's handle

  // return {};
  return notificationArray;
}
