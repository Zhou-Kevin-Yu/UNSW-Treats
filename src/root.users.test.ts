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
}
  
describe('HTTP tests for users/all/v1', () => {
  describe('Testing Error Cases for users/all/v1', () => {
    test('invalid token', () => {
      const res = request('GET', `${url}:${port}/users/all/v1`, {
        qs: {
          token: "fake token",
        }
      });
      const resObj = JSON.parse(res.body as string);
      expect(resObj).toStrictEqual({ error: 'error' });
    });
  });
  describe('Testing Success Cases of users/all/v1', () => {
    test('one user user list', () => {
      const reg1 = authRegisterSS("bk@gmail.com", "validPass98", "b", "k");
      const res = request('GET', `${url}:${port}/users/all/v1`, {
        qs: {
          token: reg1.token,
        }
      });
    });
  });
}); 
test('Test successful echo', () => {
  const res = request(
    'GET',
          `${url}:${port}/echo`,
          {
            qs: {
              echo: 'Hello',
            }
          }
  );
  const bodyObj = JSON.parse(res.body as string);
  expect(res.statusCode).toBe(OK);
  expect(bodyObj).toEqual('Hello');
});
