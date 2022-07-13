import request from 'sync-request';
import config from './config.json';
import os from 'os';

import { tokenToAuthUserId, isTokenValid } from './token';

const OK = 200;
const port = config.port;
let url = config.url;

// console.log(os.platform());

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

function clearV1ServerSide() {
  request(
    'DELETE',
            `${url}:${port}/clear/v1`
  );
}

beforeEach(() => {
  clearV1ServerSide();
});

describe('testing /user/profile/v2', () => {

});