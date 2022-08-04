import { getData } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
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
 * @param token
 * @returns 
 */
export function notificationsGetV1 (token: string) {

  const data = getData();
  // If token is invalid
  if (!isTokenValid(token)) {
    throw HTTPError(403, "token passed in is invalid");
  }

  const authUserId = tokenToAuthUserId(token, isTokenValid(token));

  // 

  // use for loops and if statements
  // to locate if occured in channel id yes or not
  // to locate if occured in dm yes or not
  // tagged is the actual string
  // reacted message is actual string
  // added to a channel/dm is actual string
  // need to find channel/dm name, message string and user's handle

  return {};
}

// ask about how to implement it for this since there are no parameters do we still do const token = req.header('token'); for notifications
// app.get('/notifications/get/v1', (req: Request, res: Response) => {
//   const token = req.header('token');
//   res.json(notificationsGetV1(token));
// });


// app.post('/message/sendlater/v1', (req: Request, res: Response) => {
//   const { channelId, message, timeSent } = req.body;
//   const token = req.header('token');
//   res.json(messageSendlaterV1(token, channelId, message, timeSent));
// });

// app.get('/dm/details/v1', (req: Request, res: Response) => {
//   const token = req.query.token as string;
//   const dmId = req.query.dmId as string;
//   const newDmId = parseInt(dmId);
//   res.json(dmDetailsV1(token, newDmId));
// });