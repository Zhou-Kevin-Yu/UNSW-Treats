import request from 'sync-request';
import config from './config.json';

import os from 'os';
import { register } from 'ts-node';

const OK = 200;
const port = config.port;
let url = config.url;

console.log(os.platform());

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach(() => {
  request('DELETE',`${url}:${port}/clear/v1`);
});

console.log(url);
describe('HTTP tests for dm/create', () => {
  describe('Testing Error Cases', () => {
    test('Invalid uId', () => {
      let res = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno@gmail.com",
          password: "validPass23",
          nameFirst: "ben",
          nameLast: "kernohan"
        }
      });
      let registerObj = JSON.parse(res.body as string);
      let token = registerObj.token;
      
      res = request('POST',`${url}:${port}/dm/create/v1`, {
        json: {
          token: token,
          uIds: [1], //this is an invalid uId
        }
      });
    });
    test('duplicate uIds invalid uId', () => {
      request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno@gmail.com",
          password: "validPass23",
          nameFirst: "ben",
          nameLast: "kernohan"
        }
      });
    });
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
      
  });
});