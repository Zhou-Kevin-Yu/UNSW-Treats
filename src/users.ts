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

  const user = dataStore.users[uId];
  
  const profile: User = {
    uId:        user.uId,
    email:      user.email,
    nameFirst:  user.nameFirst,
    nameLast:   user.nameLast,
    handleStr:  user.handleStr
  }
  return profile
}

export { userProfileV1 }
