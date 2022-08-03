export { userProfileV1 };
import { getData, setData } from './dataStore';
import { UserDetailsV1 } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import isEmail from 'validator/lib/isEmail';
import internal from 'stream';
import { channelsListV1, channelsListallV1 } from './channels';
import { dmListV1 } from './dm';
import request from 'sync-request';
import fs from 'fs';
/**
 *
 * For a valid user, returns information about their userId,
 * email, first name, last name, and handle
 *`
 * @param {number} authUserId - authorised user that can grab into about another user
 * @param {number} uId - id of the user to be queried
 * @returns {user: {
 *            uId: number,
 *            email: string,
 *            nameFirst: string,
 *            nameLast: string,
 *            handleStr: string
 *          }} - user object of queired user
 */

function userProfileV1(authUserId: number, uId: number): UserDetailsV1 {
  const dataStore = getData();

  if (!(authUserId in dataStore.users && uId in dataStore.users)) {
    return { error: 'error' };
  }

  const data = dataStore.users[uId];
  const user = {
    uId: data.uId,
    email: data.email,
    nameFirst: data.nameFirst,
    nameLast: data.nameLast,
    handleStr: data.handleStr,
  };

  return { user };
}

/**
 *
 * For a valid user, returns information about their userId,
 * email, first name, last name, and handle
 * calls userProfileV1
 *`
 * @param {string} token - valid login token
 * @param {number} uId - id of the user to be queried
 */

function userProfileV2(token: string, uId: number): UserDetailsV1 {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null) {
    return { error: 'error' };
  }

  return userProfileV1(authUserId, uId);
}

/**
 *
 * For a valid user, updates their name
 *`
 * @param {string} token - valid login token
 * @param {string} nameFirst - namefirst (must be less than 50 characters)
 * @param {string} nameLast - nameLast (must be less than 50 characters)
 */
function userProfileSetnameV1(token: string, nameFirst: string, nameLast: string): { error?: 'error' } {
  // check if token is invalid
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null) {
    return { error: 'error' };
  }

  // check if name is invalid
  if (nameFirst.length > 50 || nameFirst.length < 1) {
    return { error: 'error' };
  }
  if (nameLast.length > 50 || nameLast.length < 1) {
    return { error: 'error' };
  }

  const data = getData();
  data.users[authUserId].nameFirst = nameFirst;
  data.users[authUserId].nameLast = nameLast;
  setData(data);

  return {};
}

/**
 *
 * For a valid user, updates their email
 *`
 * @param {string} token - valid login token
 * @param {string} email - new email
 */
function userProfileSetemailV1(token: string, email: string): { error?: 'error' } {
  // check if token is invalid
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null) {
    return { error: 'error' };
  }

  // check if email is invalid
  if (!isEmail(email)) {
    return { error: 'error' };
  }

  const data = getData();

  // check if email is already registered
  for (const user of data.users) {
    if (user.email === email) {
      return { error: 'error' };
    }
  }

  data.users[authUserId].email = email;
  setData(data);

  return {};
}

/**
 *
 * For a valid user, updates their handleStr
 *`
 * @param {string} token - valid login token
 * @param {string} handle - new handle (must be greater than 3 and less than 20)
 */
function userProfileSethandleV1(token: string, handle: string): { error?: 'error' } {
  // check if token is invalid
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null) {
    return { error: 'error' };
  }

  // check the length of the handle
  if (handle.length > 20 || handle.length < 3) {
    return { error: 'error' };
  }

  // check if handle is alpa-numeric
  if (!(handle.match(/^[a-zA-Z0-9]+$/))) {
    return { error: 'error' };
  }

  // Check if handle is already taken
  const data = getData();
  for (const user of data.users) {
    if (user.handleStr === handle) {
      return { error: 'error' };
    }
  }

  data.users[authUserId].handleStr = handle;
  setData(data);

  return {};
}


function userProfileUploadPhotoV1(token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number): { error?: 'error' } {

  //xEnd is less than or equal to xStart or yEnd is less than or equal to yStart
  if (xEnd <= xStart || yEnd <= yStart) return { error: 'error' };

  const width = xEnd - xStart;
  const height = yEnd - yStart;

  //Check if image is jpg
  if (!/\.(jpg)$/.test(imgUrl))return { error: 'error' };

  const res = request(
      'GET',
      imgUrl
  );

  //Check status code of HTTP request
  if (res.statusCode !== 200) return { error: 'error' };

  const body = res.getBody();

  //Check dimensions of url....
  //crop image
  //save properly
  //app.use('/photos', express.static('photos'));
  //filename
  fs.writeFileSync('photos/test.jpg', body, { flag: 'w' });

  return {};
}

function userStatsV1(token: string) {

  const data = getData();
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) return { error: 'error' };
  
  const userChannels = channelsListV1(authUserId);
  const channelsAll = channelsListallV1(authUserId);
  const userDms = dmListV1(token);
  const channelsJoined = userChannels.channels.length;
  const dmsJoined = userDms.dms.length;
  const numChannelsAll = channelsAll.channels.length;

  let messagesSent = 0, numDmsAll = 0, numMessagesAll = 0;
  
  for(const channel of data.channels) {
      for (const message of channel.messages) {
        if(message.uId === authUserId) {
          messagesSent++;
        }
      }
  }

  for (const dm of data.dms) {
    for (const messages of dm.messages) {
      if(messages.uId === authUserId) {
        messagesSent++;
      }
      numMessagesAll++;
    }
    numDmsAll++;
  }
  let involvementRate = 0;
  const numerator = channelsJoined + dmsJoined + messagesSent;
  const denominator = numChannelsAll + numDmsAll + numMessagesAll;
  
  if(denominator != 0) involvementRate = numerator / denominator;
  if(involvementRate > 1) involvementRate = 1;

  const timeStamp = Math.floor((new Date()).getTime() / 1000);
  return {
      channelsJoined: [{numChannelsJoined: channelsJoined, timeStamp: timeStamp}],
      dmsJoined: [{numDmsJoined: dmsJoined, timeStamp: timeStamp}],
      messagesSent: [{numMessagesSent: messagesSent, timeStamp: timeStamp}],
      involvementRate: involvementRate
  };
}


export { userProfileV2, userProfileSetnameV1, userProfileSetemailV1, userProfileSethandleV1, userStatsV1, userProfileUploadPhotoV1 };
