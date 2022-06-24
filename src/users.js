import { getData, setData } from './dataStore.js';

/**
 * 
 * For a valid user, returns information about their userId, 
 * email, first name, last name, and handle
 * 
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


function userProfileV1(authUserId, uId) {
  let dataStore = getData();

  if (!(authUserId in dataStore.users && uId in dataStore.users)) {
    return { error: 'error' };
  }

  const user = dataStore.users[uId];

  return {
    uId: user.uId,
    email: user.email,
    nameFirst: user.nameFirst, 
    nameLast: user.nameLast,
    handleStr: user.handleStr,
  }
}

export { userProfileV1 }