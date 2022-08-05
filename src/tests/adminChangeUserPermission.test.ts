import config from '../config.json';
import { userProfileV2ServerSide } from '../wrapped.user';

const request = require('sync-request');

import os from 'os';
import { tokenToAuthUserId } from '../token';
import { authRegisterV2ServerSide } from '../wrapped.auth';

const OK = 200;
const port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach(() => request('DELETE', `${url}:${port}/clear/v1`));

const ownerPermission = 1;
const memberPermission = 2;

describe('Testing basic functionality', () => {
  test('Setting to new permission', () => {
    const owner = authRegisterV2ServerSide('kevinyu@unsw.com', 'KevinsPassword0', 'Kevin', 'Yu');
    const user = authRegisterV2ServerSide('Bob@email.com', 'Bobspassword0', 'Bob', 'Smith');
    let res = request('POST', `${url}:${port}/admin/userpermission/change/v1`, {
      headers: {
        token: owner.token
      },
      json: {
        uId: user.authUserId,
        permissionId: ownerPermission
      }
    });
    const userProfile = userProfileV2ServerSide(owner.token, user.authUserId);
    expect(userProfile.permission).toStrictEqual(ownerPermission);
  });
});
