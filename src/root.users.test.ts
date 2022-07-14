import request from 'sync-request';
import config from './config.json';

import os from 'os';
// import { register } from 'ts-node';

const OK = 200;
const port = config.port;
let url = config.url;

console.log(os.platform());

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}
/*
function authRegisterSS(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
          `${url}:${port}/auth/register/v2`,
          {
            json: {
              email,
              password,
              nameFirst,
              nameLast,
            }
          }
  );
  return JSON.parse(res.body as string);
}*/
test('Test successful echo', () => {
  const res = request(
    'POST',
          `${url}:${port}/dm/create/v1`,
          {
            json: {
              token: '0',
              uIds: [1, 1, 2]
            }
          }
  );
  const bodyObj = JSON.parse(res.body as string);
  expect(res.statusCode).toBe(OK);
  expect(bodyObj).toEqual('Hello');
});

