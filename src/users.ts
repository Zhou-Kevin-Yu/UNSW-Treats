import { channelsListV1 } from './channels';
import { getData, UserAllV1, User, Dm } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import { userProfileV1 } from './user';
import HTTPError from 'http-errors';

function usersAllV1(token: string): UserAllV1 {
  const data = getData();
  // get token and return error if invalid
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    return { error: 'error' };
  }
  const userArr: User[] = [];
  for (const user of data.users) {
    const currUser : User = userProfileV1(authUserId, user.uId).user;
    userArr.push(currUser);
  }
  return { users: userArr };
}


function usersStatsV1() {
  
  const data = getData();

  let numChannels = 0, numDms = 0, numMessages = 0, numActiveUsers = 0, numUsers = 0;
  for (const channel of data.channels) {
    for (const message of channel.messages) {
      numMessages++;
    }
    numChannels++;
  }
  for (const dm of data.dms) {
    for(const message of dm.messages) {
      numMessages++;
    }
    numDms++;
  }

  for (const user of data.users) {
    const userChannels = channelsListV1(user.uId);
    const userDms = dmListHelperFunction(user.uId);
    if (userChannels.channels.length !== 0 || userDms.dms.length !== 0) {
      numActiveUsers++;
    }
    numUsers++;
  }

  const utilizationRate = numActiveUsers / numUsers;
  const timeStamp = Math.floor((new Date()).getTime() / 1000);
  return {
      channelsExist: [{numChannelsExist: numChannels, timeStamp: timeStamp}],
      dmsExist: [{numDmsExist: numDms, timeStamp: timeStamp}],
      messagesExist: [{numMessagesExist: numMessages, timeStamp: timeStamp}],
      utilizationRate: utilizationRate
  };
}

function dmListHelperFunction(uId: number) {
  const data = getData();
  const userDms: Dm[] = [];
  for (const dm of data.dms) {
    if (dm !== undefined && dm !== null && dm.members.includes(uId)) {
      const tempDm: Dm = {
        dmId: dm.dmId,
        name: dm.name,
      };
      userDms.push(tempDm);
    }
  }
  return { dms: userDms };
}


function usersAllV3(token: string): UserAllV1 {
  const data = getData();
  // get token and return error if invalid
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (!isTokenValid(token)) {
    throw HTTPError(400, 'Invalid token');
  }
  const userArr: User[] = [];
  for (const user of data.users) {
    const currUser : User = userProfileV1(authUserId, user.uId).user;
    userArr.push(currUser);
  }
  return { users: userArr };
}

export { usersAllV1, usersAllV3, usersStatsV1 };
