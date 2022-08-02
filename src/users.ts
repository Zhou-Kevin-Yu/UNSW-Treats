import { channelsListV1 } from './channels';
import { getData, UserAllV1, User, Dm } from './dataStore';
import { tokenToAuthUserId, isTokenValid } from './token';
import { userProfileV1 } from './user';


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

  let numChannels = 0;
  for (const channel of data.channels) {
    numChannels++;
  }
  let numDms = 0;
  let numMessages = 0;
  for (const dm of data.dms) {
    for(const message of dm.messages) {
      numMessages++;
    }
    numDms++;
  }

  let numActiveUsers = 0;
  let numUsers = 0;
  for (const user of data.users) {
    const userChannels = channelsListV1(user.uId);
    const userDms = dmListHelperFunction(user.uId);
    if (Object.keys(userChannels).length != 0 || Object.keys(userDms).length != 0) {
      numActiveUsers++;
    }
    numUsers++;
  }

  const utilizationRate = numActiveUsers / numUsers;
  const timeStamp = Math.floor((new Date()).getTime() / 1000);
  return {
      channelsExist: [{numChannels, timeStamp}],
      dmsExist: [{numDms, timeStamp}],
      messagesExist: [{numMessages, timeStamp}],
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


export { usersAllV1, usersStatsV1 };
