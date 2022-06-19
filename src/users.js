import { getData, setData } from './dataStore.js';

function userProfileV1(authUserId, uId) {
  let dataStore = getData();

  if (!(authUserId in dataStore.users && uId in dataStore.users)) {
    return { error: 'error' };
  }

  user = dataStore.users[uId];

  return {
    uId: user.uId,
    email: user.email,
    nameFirst: user.nameFirst, 
    nameLast: user.nameLast,
    handleStr: user.handleStr,
  }
}

export { userProfileV1 }