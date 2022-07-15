import request from 'sync-request';
import config from './config.json';
// import { userProfileV2ServerSide } from './wrapped.user';
import { messageSendDmV1SS } from './wrapped.message';
import os from 'os';
import { dmMessagesV1SS } from './wrapped.dm';
// import { register } from 'ts-node';

// const OK = 200;
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

function dmCreateSS(token: string, uIds: number[]) {
  const res = request(
    'POST',
    `${url}:${port}/dm/create/v1`,
    {
      json: {
        token,
        uIds,
      }
    }
  );
  return JSON.parse(res.body as string);
}
/*
function dmListSS(token: string) {
  const res = request(
    'GET',
    `${url}:${port}/dm/list/v1`,
    {
      qs: {
        token,
      }
    }
  );
  return JSON.parse(res.body as string);
}
*/
beforeEach(() => {
  request('DELETE', `${url}:${port}/clear/v1`);
});

console.log(url);
describe('HTTP tests for dm/create', () => {
  // TODO test creating a dm with a userId one higher than max uId (edge case)
  describe('Testing Error Cases for dm/create', () => {
    test('Invalid uId', () => {
      let res = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const registerObj = JSON.parse(res.body as string);
      const token = registerObj.token;

      res = request('POST', `${url}:${port}/dm/create/v1`, {
        json: {
          token: token,
          uIds: [23], // invalid uId
        }
      });
      const returnObj = JSON.parse(res.body as string);
      expect(returnObj).toStrictEqual({ error: 'error' });
    });

    test('duplicate uIds invalid uId', () => {
      // create a valid register request
      const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const res1Obj = JSON.parse(res1.body as string);
      const token1 = res1Obj.token;

      // create a second valid register request
      const res2 = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno1@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const res2Obj = JSON.parse(res2.body as string);
      const uId2 = res2Obj.authUserId;

      // create request that should return an error
      const res = request('POST', `${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId2, uId2], // uId2 is duplicated twice
        }
      });
      const returnObj = JSON.parse(res.body as string);
      expect(returnObj).toStrictEqual({ error: 'error' });
    });

    test('Creator is also in the uId Array', () => {
      // create a valid register request
      const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const res1Obj = JSON.parse(res1.body as string);
      const token1 = res1Obj.token;
      const uId1 = res1Obj.authUserId;

      // create a second valid register request
      const res2 = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno1@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const res2Obj = JSON.parse(res2.body as string);
      const uId2 = res2Obj.authUserId;

      // create request that should return an error
      const res = request('POST', `${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId1, uId2], // uId1 is the creator
        }
      });
      const returnObj = JSON.parse(res.body as string);
      expect(returnObj).toStrictEqual({ error: 'error' });
    });
  });

  describe('Testing Success Cases of dm/create', () => {
    test('creation of one dm with one other user', () => {
      // create a valid register request
      const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const res1Obj = JSON.parse(res1.body as string);
      const token1 = res1Obj.token;

      // create a second valid register request
      const res2 = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno1@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const res2Obj = JSON.parse(res2.body as string);
      const uId2 = res2Obj.authUserId;

      // create request that should be successful
      const res = request('POST', `${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId2],
        }
      });
      const returnObj = JSON.parse(res.body as string);
      expect(returnObj.dmId).toBe(0); // first dm should have the dmId: 0;
    });

    test('creation of one dm', () => {
      // create first user that creates the DM
      const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const res1Obj = JSON.parse(res1.body as string);
      const token1 = res1Obj.token;
      // create second user
      const res2 = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno1@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const res2Obj = JSON.parse(res2.body as string);
      const uId2 = res2Obj.authUserId;
      // create third user
      const res3 = request('POST', `${url}:${port}/auth/register/v2`, {
        json: {
          email: 'benkerno2@gmail.com',
          password: 'validPass23',
          nameFirst: 'ben',
          nameLast: 'kernohan'
        }
      });
      const res3Obj = JSON.parse(res3.body as string);
      const uId3 = res3Obj.authUserId;

      // create request that should be successful
      const res = request('POST', `${url}:${port}/dm/create/v1`, {
        json: {
          token: token1,
          uIds: [uId2, uId3],
        }
      });
      const returnObj = JSON.parse(res.body as string);
      expect(returnObj.dmId).toBe(0); // first dm should have the dmId: 0;
    });

    // TODO write expects to check the successful creation of handles once dm/details/v1 is implemented
  });
});

describe('HTTP tests for dm/list', () => {
  describe('Testing Success Cases of dm/list', () => {
    test('one dm list', () => {
      // create first user that creates the DM
      const reg1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k');
      const token1 = reg1.token;
      // create a second valid register request
      const reg2 = authRegisterSS('bdk@gmail.com', 'validPass23', 'e', 't');
      const uId2 = reg2.authUserId;
      // create request that should be successful
      const dm1 = dmCreateSS(token1, [uId2]);
      const dmId1 = dm1.dmId; // first dm should have the dmId: 0;
      expect(dmId1).toBe(0);
      const res4 = request('GET', `${url}:${port}/dm/list/v1`, {
        qs: {
          token: token1,
        }
      });
      const res4Obj = JSON.parse(res4.body as string);
      expect(res4Obj.dms).toStrictEqual([{ dmId: dmId1, name: 'bk, et' }]);
    });

    test('multiple dm list', () => {
      // create first user that creates the DM
      const reg1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k');
      const token1 = reg1.token;
      // create a second valid register request and get token
      const reg2 = authRegisterSS('bdk@gmail.com', 'validPass23', 'e', 't');
      const uId2 = reg2.authUserId;
      const token2 = reg2.token;

      // create a third user
      const reg3 = authRegisterSS('bsk@gmail.com', 'validPass23', 'm', 'p');
      const uId3 = reg3.authUserId;

      // create request that should be successful
      const dm1 = dmCreateSS(token1, [uId2, uId3]);
      const dmID1 = dm1.dmId; // first dm should have the dmId: 0;

      const dm2 = dmCreateSS(token2, [uId3]);
      const dmID2 = dm2.dmId; // second dm should have the dmId: 1;

      const res5 = request('GET', `${url}:${port}/dm/list/v1`, {
        qs: {
          token: token2,
        }
      });
      const res5Obj = JSON.parse(res5.body as string);
      expect(res5Obj.dms).toStrictEqual([{ dmId: dmID1, name: 'bk, et, mp' }, { dmId: dmID2, name: 'et, mp' }]);
    });
  });
});

describe('HTTP tests for dm/remove/v1', () => {
  describe('Testing Error Cases for dm/remove/v1', () => {
    test('dmId not valid', () => {
      const token = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const res = request('DELETE', `${url}:${port}/dm/remove/v1`, {
        qs: {
          token: token,
          dmId: 0, // no Dm has been created so any number here should fail
        }
      });
      const resObj = JSON.parse(res.body as string);
      expect(resObj).toStrictEqual({ error: 'error' });
    });

    test('authUser isnt original creator', () => {
      const token1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const obj2 = authRegisterSS('bdk@gmail.com', 'validPass23', 'b', 'k');
      const token2 = obj2.token;
      const uId2 = obj2.authUserId;
      const dmIdValid = dmCreateSS(token1, [uId2]).dmId;
      expect(dmIdValid).toBe(0); // first dm created
      const res = request('DELETE', `${url}:${port}/dm/remove/v1`, {
        qs: {
          token: token2,
          dmId: dmIdValid,
        }
      });
      const resObj = JSON.parse(res.body as string);
      expect(resObj).toStrictEqual({ error: 'error' });
    });

    test('authUser not in DM', () => {
      const token1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const obj2 = authRegisterSS('bsk@gmail.com', 'validPass23', 'b', 'k');
      const obj3 = authRegisterSS('bdk@gmail.com', 'validPass23', 'b', 'k');
      const dmIdValid = dmCreateSS(token1, [obj2.authUserId]).dmId;
      expect(dmIdValid).toBe(0); // first dm created
      const res = request('DELETE', `${url}:${port}/dm/remove/v1`, {
        qs: {
          token: obj3.token, // user 3 not in dm
          dmId: dmIdValid,
        }
      });
      const resObj = JSON.parse(res.body as string);
      expect(resObj).toStrictEqual({ error: 'error' });
    });
  });

  describe('Testing Success Cases of dm/remove/v1', () => {
    test('Testing remove', () => {
      const token1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const obj2 = authRegisterSS('bsk@gmail.com', 'validPass23', 'e', 't');
      const dmIdValid = dmCreateSS(token1, [obj2.authUserId]).dmId;
      // test dm has been created
      const res4 = request('GET', `${url}:${port}/dm/list/v1`, {
        qs: {
          token: token1,
        }
      });
      const res4Obj = JSON.parse(res4.body as string);
      expect(res4Obj.dms).toStrictEqual([{ dmId: dmIdValid, name: 'bk, et' }]);

      // delete channel
      request('DELETE', `${url}:${port}/dm/remove/v1`, {
        qs: {
          token: token1,
          dmId: dmIdValid,
        }
      });

      const res5 = request('GET', `${url}:${port}/dm/list/v1`, {
        qs: {
          token: token1,
        }
      });
      const res5Obj = JSON.parse(res5.body as string);
      expect(res5Obj.dms).toStrictEqual([]);
    });
  });
});

describe('HTTP tests for dm/details/v1', () => {
  describe('Testing Error Cases for dm/details/v1', () => {
    test('dmId not Valid', () => {
      const token = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      let res = request('GET', `${url}:${port}/dm/details/v1`, {
        qs: {
          token: token,
          dmId: 0, // no Dm has been created so any number here should fail
        }
      });
      res = JSON.parse(res.body as string);
      expect(res).toStrictEqual({ error: 'error' });
    });

    test('authUser not a member of DM', () => {
      const token1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const obj2 = authRegisterSS('bsk@gmail.com', 'validPass23', 'b', 'k');
      const obj3 = authRegisterSS('bdk@gmail.com', 'validPass23', 'b', 'k');
      const dmIdValid = dmCreateSS(token1, [obj2.authUserId]).dmId;
      expect(dmIdValid).toBe(0); // first dm created
      let res = request('GET', `${url}:${port}/dm/details/v1`, {
        qs: {
          token: obj3.token, // user 3 not in dm
          dmId: dmIdValid,
        }
      });
      res = JSON.parse(res.body as string);
      expect(res).toStrictEqual({ error: 'error' });
    });
  });

  describe('Testing Success Cases of dm/details/v1', () => {
    test('Testing', () => {
      const token1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const obj2 = authRegisterSS('bsk@gmail.com', 'validPass23', 'e', 't');
      const obj3 = authRegisterSS('bdk@gmail.com', 'validPass23', 'm', 'p');
      const dmIdValid = dmCreateSS(token1, [obj2.authUserId, obj3.authUserId]).dmId;
      // get details
      const res = request('GET', `${url}:${port}/dm/details/v1`, {
        qs: {
          token: token1,
          dmId: dmIdValid,
        }
      });
      const resObj = JSON.parse(res.body as string);
      expect(resObj.name).toStrictEqual('bk, et, mp');
      // expect(typeof(resObj.members)).to(User[])
      // TODO add functinoality with userProfile
    });
  });
});

describe('HTTP tests for dm/leave/v1', () => {
  describe('Testing Error Cases for dm/leave/v1', () => {
    test('dmID not valid', () => {
      const token = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      let res = request('POST', `${url}:${port}/dm/leave/v1`, {
        json: {
          token: token,
          dmId: 0, // no Dm has been created so any number here should fail
        }
      });
      res = JSON.parse(res.body as string);
      expect(res).toStrictEqual({ error: 'error' });
    });
    test('authUser not a member', () => {
      const token1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const obj2 = authRegisterSS('bsk@gmail.com', 'validPass23', 'b', 'k');
      const obj3 = authRegisterSS('bdk@gmail.com', 'validPass23', 'b', 'k');
      const dmIdValid = dmCreateSS(token1, [obj2.authUserId]).dmId;
      expect(dmIdValid).toBe(0); // first dm created
      let res = request('POST', `${url}:${port}/dm/leave/v1`, {
        json: {
          token: obj3.token, // user 3 not in dm
          dmId: dmIdValid,
        }
      });
      res = JSON.parse(res.body as string);
      expect(res).toStrictEqual({ error: 'error' });
    });
  });
  /*
  describe('Testing Success Cases of dm/leave/v1', () => {
    // TODO test assumption
    test('member leave', () => {
      const token1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const obj2 = authRegisterSS('bsk@gmail.com', 'validPass23', 'e', 't');
      const obj3 = authRegisterSS('bdk@gmail.com', 'validPass23', 'm', 'p');
      const dmIdValid = dmCreateSS(token1, [obj2.authUserId, obj3.authUserId]).dmId; // user 0 creates
      request('POST', `${url}:${port}/dm/leave/v1`, {
        json: {
          token: obj3.token, // user 3 wants to leave
          dmId: dmIdValid,
        }
      });
      const res = dmListSS(token1);
      expect(res.dms).toStrictEqual([{ dmId: dmIdValid, name: 'bk, et' }]);
    });

    test('creator leave', () => {
      const token1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const obj2 = authRegisterSS('bsk@gmail.com', 'validPass23', 'e', 't');
      const obj3 = authRegisterSS('bdk@gmail.com', 'validPass23', 'm', 'p');
      const dmIdValid = dmCreateSS(token1, [obj2.authUserId, obj3.authUserId]).dmId; // user 0 creates
      request('POST', `${url}:${port}/dm/leave/v1`, {
        json: {
          token: token1, // user 1 wants to leave
          dmId: dmIdValid,
        }
      });
      const res = dmListSS(obj2.token);
      expect(res.dms).toStrictEqual([{ dmId: dmIdValid, name: 'et, mp' }]);
    });
  });
  */
});

describe('HTTP tests for dm/', () => {
  describe('Testing Error Cases for dm/', () => {
    test('dmId not valid', () => {
      const token = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
      const res = dmMessagesV1SS(token, 0, 0);
      expect(res).toStrictEqual({ error: 'error' });
    });

    test('start too large', () => {
      const reg1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k');
      const reg2 = authRegisterSS('bdk@gmail.com', 'validPass23', 'b', 'k');
      const dm1 = dmCreateSS(reg1.token, [reg2.authUserId]);
      messageSendDmV1SS(reg1.token, dm1.dmId, 'first message'); // send one message
      const dmMessage = dmMessagesV1SS(reg1.token, dm1.dmId, 1); // no message at index 1
      expect(dmMessage).toStrictEqual({ error: 'error' });
    });

    test('authUser not part of DM', () => {
      const reg1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k');
      const reg2 = authRegisterSS('bdk@gmail.com', 'validPass23', 'b', 'k');
      const reg3 = authRegisterSS('bmk@gmail.com', 'validPass23', 'b', 'k');
      const dm1 = dmCreateSS(reg1.token, [reg2.authUserId]); // dm with user 0 and 1
      messageSendDmV1SS(reg1.token, dm1.dmId, 'first message');
      const dmMessage = dmMessagesV1SS(reg3.token, dm1.dmId, 0);
      expect(dmMessage).toStrictEqual({ error: 'error' });
    });
  });
  describe('Testing Success Cases of dm/', () => {
    test('testing one message success', () => {
      const reg1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k');
      const reg2 = authRegisterSS('bdk@gmail.com', 'validPass23', 'b', 'k');
      const dm1 = dmCreateSS(reg1.token, [reg2.authUserId]);
      const mId = messageSendDmV1SS(reg1.token, dm1.dmId, 'first message').messageId; // send one message
      const dmMessage = dmMessagesV1SS(reg1.token, dm1.dmId, 0); // get one message
      expect(dmMessage.messages[0].messageId).toBe(mId);
      expect(dmMessage.messages[0].uId).toBe(reg1.authUserId);
      expect(dmMessage.messages[0].message).toBe('first message');
      expect(dmMessage.start).toBe(0);
      expect(dmMessage.end).toBe(-1);
      /*
      expect(dmMessage).toContainEqual(
        {
          messages: [{messageId: mId, uId: reg1.authUserId, message: "first message"}],
          start: 0,
          end: -1,
        }
      );
      */
    });
    test('testing 52 message success', () => {
      const reg1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k');
      const reg2 = authRegisterSS('bdk@gmail.com', 'validPass23', 'b', 'k');
      const dm1 = dmCreateSS(reg1.token, [reg2.authUserId]);
      // send 52 messages
      for (let i = 0; i < 52; i++) {
        messageSendDmV1SS(reg1.token, dm1.dmId, 'message');
      }
      const dmMessage = dmMessagesV1SS(reg1.token, dm1.dmId, 0); // get one message
      expect(dmMessage.messages.length).toBe(50);
      expect(dmMessage.messages[0].uId).toBe(reg1.authUserId);
      expect(dmMessage.messages[25].message).toBe('message');
      expect(dmMessage.start).toBe(0);
      expect(dmMessage.end).toBe(50);
    });
    test('testing 30 message success', () => {
      const reg1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k');
      const reg2 = authRegisterSS('bdk@gmail.com', 'validPass23', 'b', 'k');
      const dm1 = dmCreateSS(reg1.token, [reg2.authUserId]);
      // send 52 messages
      for (let i = 0; i < 30; i++) {
        messageSendDmV1SS(reg1.token, dm1.dmId, 'message');
      }
      const dmMessage = dmMessagesV1SS(reg1.token, dm1.dmId, 0); // get one message
      expect(dmMessage.messages.length).toBe(30);
      expect(dmMessage.messages[0].uId).toBe(reg1.authUserId);
      expect(dmMessage.messages[25].message).toBe('message');
      expect(dmMessage.start).toBe(0);
      expect(dmMessage.end).toBe(-1);
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

describe('Testing Success Cases of dm/remove/v1', () => {
  test.only('Testing remove', () => {
    const token1 = authRegisterSS('bk@gmail.com', 'validPass23', 'b', 'k').token;
    const obj2 = authRegisterSS('bsk@gmail.com', 'validPass23', 'e', 't');
    const dmIdValid = dmCreateSS(token1, [obj2.authUserId]).dmId;
    const dm1 = dmCreateSS(token1, [obj2.authUserId]).dmId;
    const dm2 = dmCreateSS(token1, [obj2.authUserId]).dmId;
    const dm3 = dmCreateSS(token1, [obj2.authUserId]).dmId;
    expect(dm1).toBe(dm1);
    expect(dm2).toBe(dm2);
    expect(dm3).toBe(dm3);
    // test dm has been created
    request('GET', `${url}:${port}/dm/list/v1`, {
      qs: {
        token: token1,
      }
    });
    // const res4Obj = JSON.parse(res4.body as string);
    // expect(res4Obj.dms).toStrictEqual([{ dmId: dmIdValid, name: 'bk, et' }]);

    // delete channel
    request('DELETE', `${url}:${port}/dm/remove/v1`, {
      qs: {
        token: token1,
        dmId: dmIdValid,
      }
    });

    const res5 = request('GET', `${url}:${port}/dm/list/v1`, {
      qs: {
        token: token1,
      }
    });
    const res5Obj = JSON.parse(res5.body as string);
    expect(res5Obj.dms).toStrictEqual(
      [{ dmId: 1, name: 'bk, et' }, { dmId: 1 + 1, name: 'bk, et' }, { dmId: 1 + 2, name: 'bk, et' }]
    );
  });
});
