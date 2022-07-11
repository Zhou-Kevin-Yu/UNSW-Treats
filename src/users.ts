import { isNamedTupleMember } from 'typescript';
import { getData, setData } from './dataStore';

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

export interface User {
  uId:          number,
  email:        string,
  nameFirst:    string,
  nameLast:     string,
  handleStr:    string,
  password?:    string,
  permission?:  number
}

function userProfileV1(authUserId: number, uId: number) {
  let dataStore = getData();

  if (!(authUserId in dataStore.users && uId in dataStore.users)) {
    return { error: 'error' };
  }

  const userData = dataStore.users[uId];
  
  const user: User = {
    uId:        userData.uId,
    email:      userData.email,
    nameFirst:  userData.nameFirst,
    nameLast:   userData.nameLast,
    handleStr:  userData.handleStr
  }
  return {user}
}

export { userProfileV1 }
