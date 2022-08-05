import config from '../config.json';
import request from 'sync-request';
import os from 'os';

import { authRegisterV2ServerSide } from '../wrapped.auth';
import { adminChangeUserPermissionV1ServerSide, adminUserRemoveV1ServerSide } from '../admin';
import { isTokenValid } from '../token';

const OK = 200;
const port = config.port;
let url = config.url;


if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

function clearV1ServerSide() {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`
  );
}

beforeEach(() => clearV1ServerSide());

const ownerPermission = 1;
const memberPermission = 2;

describe('Testing basic functionality', () => {
  test('Setting to new permission', () => {
    const owner = authRegisterV2ServerSide('owner@email.com', 'Password0', 'owner', '0');
    const user = authRegisterV2ServerSide('user@email.com', 'Password1', 'user', '1');
    console.log(isTokenValid(owner.token), isTokenValid(user.token));
    adminChangeUserPermissionV1ServerSide(owner.token, user.authUserId, ownerPermission)
    const res = JSON.parse(adminUserRemoveV1ServerSide(user.token, owner.authUserId).body as string);
    expect(res).toStrictEqual({});
  });
});
