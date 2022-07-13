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
          uIds: [23], //invalid uId
        }
      });
      const returnObj = JSON.parse(res.body as string);
      expect(returnObj).toBe({error: 'error'})
    });


    test('duplicate uIds invalid uId', () => {
      //create a valid register request
      let res1 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno@gmail.com",
          password: "validPass23",
          nameFirst: "ben",
          nameLast: "kernohan"
        }
      });
      let res1Obj = JSON.parse(res1.body as string);
      let token1 = res1Obj.token;
      let uId1 = res1Obj.authUserId;

      //create a second valid register request
      let res2 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno1@gmail.com",
          password: "validPass23",
          nameFirst: "ben",
          nameLast: "kernohan"
        }
      });
      let res2Obj = JSON.parse(res2.body as string);
      let uId2 = res1Obj.authUserId;

      //create request that should return an error
      let res = request('POST',`${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId2, uId2], //uId2 is duplicated twice
        }
      });
    const returnObj = JSON.parse(res.body as string);
    expect(returnObj).toBe({error: 'error'})
    });


    test('Creator is also in the uId Array', () => {
      //create a valid register request
      let res1 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno@gmail.com",
          password: "validPass23",
          nameFirst: "ben",
          nameLast: "kernohan"
        }
      });
      let res1Obj = JSON.parse(res1.body as string);
      let token1 = res1Obj.token;
      let uId1 = res1Obj.authUserId;

      //create a second valid register request
      let res2 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno1@gmail.com",
          password: "validPass23",
          nameFirst: "ben",
          nameLast: "kernohan"
        }
      });
      let res2Obj = JSON.parse(res2.body as string);
      let uId2 = res1Obj.authUserId;

      //create request that should return an error
      let res = request('POST',`${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId1, uId2], //uId1 is the creator
        }
      });
    const returnObj = JSON.parse(res.body as string);
    expect(returnObj).toBe({error: 'error'})
    });
  });

  describe('Testing Success Cases', () => {

    test('creation of one dm', () => {
      //create a valid register request
      let res1 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno@gmail.com",
          password: "validPass23",
          nameFirst: "ben",
          nameLast: "kernohan"
        }
      });
      let res1Obj = JSON.parse(res1.body as string);
      let token1 = res1Obj.token;
      let uId1 = res1Obj.authUserId;

      //create a second valid register request
      let res2 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno1@gmail.com",
          password: "validPass23",
          nameFirst: "ben",
          nameLast: "kernohan"
        }
      });
      let res2Obj = JSON.parse(res2.body as string);
      let uId2 = res1Obj.authUserId;

      //create request that should be successful
      let res = request('POST',`${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId2], //uId2 is duplicated twice
        }
      });
    const returnObj = JSON.parse(res.body as string);
    expect(returnObj.dmId).toBe(0); //think this has to stay at 0?;
    });
  });

    /*
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
    */
 
});