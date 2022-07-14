import { getData, UserAllV1, User } from './dataStore'
import { tokenToAuthUserId, isTokenValid } from './token';
import { userProfileV1 } from './user'

function usersAllV1(token: string): UserAllV1 {
  let data = getData();
  //get token and return error if invalid
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

export { usersAllV1 };