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
  describe('Testing Error Cases for dm/create', () => {

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

  describe('Testing Success Cases of dm/create', () => {

    test('creation of one dm with one other user', () => {
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
      let uId2 = res2Obj.authUserId;

      //create request that should be successful
      let res = request('POST',`${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId2],
        }
      });
      const returnObj = JSON.parse(res.body as string);
      expect(returnObj.dmId).toBe(0); //first dm should have the dmId: 0;
    });


    test('creation of one dm', () => {
      //create first user that creates the DM
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
      //create second user
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
      //create third user
      let res3 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno2@gmail.com",
          password: "validPass23",
          nameFirst: "ben",
          nameLast: "kernohan"
        }
      });
      let res3Obj = JSON.parse(res2.body as string);
      let uId3 = res1Obj.authUserId;

      //create request that should be successful
      let res = request('POST',`${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId2, uId3],
        }
      });
      const returnObj = JSON.parse(res.body as string);
      expect(returnObj.dmId).toBe(0); //first dm should have the dmId: 0;
    });

    //TODO write expects to check the successful creation of handles once dm/details/v1 is implemented
  });
});

describe('HTTP tests for dm/list', () => {
  describe('Testing Success Cases of dm/list', () => {
    test('one dm list', () => {
      //create first user that creates the DM
      const res1 = request('POST',`${url}:${port}/auth/register/v2`, {
          json: {
            email: "benkerno@gmail.com",
            password: "validPass23",
            nameFirst: "b",
            nameLast: "k"
          }
      });
      const res1Obj = JSON.parse(res1.body as string);
      const token1 = res1Obj.token;
      //create a second valid register request
      const res2 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno1@gmail.com",
          password: "validPass23",
          nameFirst: "e",
          nameLast: "t"
        }
      });
      const res2Obj = JSON.parse(res2.body as string);
      const uId2 = res2Obj.authUserId;

      //create request that should be successful
      const res3 = request('POST',`${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId2],
        }
      });
      const returnObj = JSON.parse(res3.body as string);
      const dmID1 = returnObj.dmId; //first dm should have the dmId: 0;

      const res4 = request('GET',`${url}:${port}/dm/list/v1`, {
        qs: {
          token: token1,
        }
      });
      const res4Obj = JSON.parse(res2.body as string);
      expect(res4Obj.dms).toStrictEqual([{dmId:0, name: "bk, et"}]);
    });


    test('multiple dm list', () => {
      //create first user that creates the DM
      const res1 = request('POST',`${url}:${port}/auth/register/v2`, {
          json: {
            email: "benkerno@gmail.com",
            password: "validPass23",
            nameFirst: "b",
            nameLast: "k"
          }
      });
      const res1Obj = JSON.parse(res1.body as string);
      const uId1 = res1Obj.authUserId;
      const token1 = res1Obj.token;
      //create a second valid register request and get token
      const res2 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno1@gmail.com",
          password: "validPass23",
          nameFirst: "e",
          nameLast: "t"
        }
      });
      const res2Obj = JSON.parse(res2.body as string);
      const uId2 = res2Obj.authUserId;
      const token2 = res2Obj.token;

      //create a third user
      const res3 = request('POST',`${url}:${port}/auth/register/v2`, {
        json: {
          email: "benkerno2@gmail.com",
          password: "validPass23",
          nameFirst: "m",
          nameLast: "p"
        }
      });
      const res3Obj = JSON.parse(res2.body as string);
      const uId3 = res1Obj.authUserId;

      //create request that should be successful
      let res4 = request('POST',`${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId2, uId3],
        }
      });
      let returnObj = JSON.parse(res4.body as string);
      const dmID1 = returnObj.dmId; //first dm should have the dmId: 0;

      res4 = request('POST',`${url}:${port}/dm/create/v1`, {
        json: {
          token: token2,
          uIds: [uId3],
        }
      });
      returnObj = JSON.parse(res4.body as string);
      const dmID2 = returnObj.dmId; //second dm should have the dmId: 2;



      const res5 = request('GET',`${url}:${port}/dm/list/v1`, {
        qs: {
          token: token2,
        }
      });
      const res4Obj = JSON.parse(res2.body as string);
      expect(res4Obj.dms).toStrictEqual([{dmId:0, name: "bk, et, mp"}, {dmId:1, name: "mp, et"}]);
    });
  });
});

/*
test('Testing', () => {

});
describe('HTTP tests for dm/', () => {
  describe('Testing Error Cases for dm/', () => {

  });
  describe('Testing Success Cases of dm/', () => {

  });
});
*/
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
 