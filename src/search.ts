import { getData } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import HTTPError from 'http-errors';

// do i need to export interface

/**
 * Given a query string, return a collection of messages in all of the 
 * channels/DMs that the user has joined that contain the query (case-insensitive)
 * There is no expected order for these messages
 * @param token 
 * @returns 
 */
export function searchV1 (token: string, queryStr: string) {

  // const data = getData();
  // // If token is invalid
  // if (!isTokenValid(token)) {
  //   throw HTTPError(403, "token passed in is invalid");
  // }

  // // If length of queryStr is less than 1 or over 1000 characters
  // if (queryStr.length < 1 || queryStr.length > 1000) {
  //   throw HTTPError(400, "length of queryStr is less than 1 or over 1000 characters");
  // }

  // const authUserId = tokenToAuthUserId(token, isTokenValid(token));

  // how to implement this
  // I think it is like channel/messages and channel/invite
  // I grab the stuff out of messages plus other stuff in the object
  
  return {};
  
  // returns messages
  // Array of objects, where each object contains types { messageId, uId, message, timeSent, reacts, isPinned  }
  // reacts is Array of objects, where each object contains types { reactId, uIds, isThisUserReacted } where: 
  // reactId is the id of a react
  // uIds is an array of user id's of people who've reacted for that react
  // isThisUserReacted is whether or not the authorised user (user making the request) currently has one of the reacts to this message
}

// app.get('/search/v1', (req: Request, res: Response) => {
//   const token = req.header('token');
//   res.json(searchV1(token, ));
// });