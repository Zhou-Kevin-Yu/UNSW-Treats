import { getData } from './dataStore';
import { UserDetailsV1 } from './dataStore';

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

export { userProfileV1 };
