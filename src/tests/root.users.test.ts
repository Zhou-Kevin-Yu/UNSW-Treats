import request from 'sync-request';
import config from '../config.json';
import { userProfileUploadPhotoV1SS, userStatsV1SS, usersStatsV1SS, userProfileV2ServerSide } from '../wrapped.user';
import { channelsCreateV2SS } from '../wrapped.channels';
import { dmCreateV1SS } from '../wrapped.dm';
import { messageSendV1SS } from '../wrapped.message';


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
          `${url}:${port}/auth/register/v3`,
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

beforeEach(() => {
  request('DELETE', `${url}:${port}/clear/v1`);
});

describe('HTTP tests for users/all/v1', () => {
  describe('Testing Error Cases for users/all/v1', () => {
    test('invalid token', () => {
      const res = request('GET', `${url}:${port}/users/all/v1`, {
        qs: {
          token: 'fake token',
        }
      });
      const resObj = JSON.parse(res.body as string);
      expect(resObj).toStrictEqual({ error: 'error' });
    });
  });
  describe('Testing Success Cases of users/all/v1', () => {
    test('one user user list', () => {
      const reg1 = authRegisterSS('bk@gmail.com', 'validPass98', 'b', 'k');
      const res = request('GET', `${url}:${port}/users/all/v1`, {
        qs: {
          token: reg1.token,
        }
      });
      const resObj = JSON.parse(res.body as string);
      const user = request('GET', `${url}:${port}/user/profile/v2`, {
        qs: {
          token: reg1.token,
          uId: reg1.authUserId,
        }
      });
      const userObj = JSON.parse(user.body as string).user;
      expect(resObj.users[0]).toStrictEqual(userObj);
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

describe('Testing user setname', () => {
  test('setname', () => {
    const reg1 = authRegisterSS('bk@gmail.com', 'validPass98', 'b', 'k');
    const reg2 = authRegisterSS('gary.sun@gmail.com', 'rnadom8', 'gary', 'sun');
    const reg3 = authRegisterSS('jeff.bezossun@gmail.com', 'rfswee', 'jess', 'bezos');
    const res = request('GET', `${url}:${port}/user/profile/v2`, {
      qs: {
        token: reg1.token,
        uId: reg1.authUserId,
      }
    });
    const resObj = JSON.parse(res.body as string);
    expect(resObj).toStrictEqual({
      user: {
        uId: reg1.authUserId,
        email: 'bk@gmail.com',
        nameFirst: 'b',
        nameLast: 'k',
        handleStr: 'bk' // expect any string
      }
    });

    const res1 = request('GET', `${url}:${port}/users/all/v1`, {
      qs: {
        token: reg1.token,
      }
    });
    const result = JSON.parse(res1.body as string);
    expect(res1.statusCode).toBe(200);
    expect(result).toStrictEqual({
      users: [
        {
          uId: reg1.authUserId,
          email: 'bk@gmail.com',
          nameFirst: 'b',
          nameLast: 'k',
          handleStr: 'bk'
        },
        {
          uId: reg2.authUserId,
          email: 'gary.sun@gmail.com',
          nameFirst: 'gary',
          nameLast: 'sun',
          handleStr: 'garysun'
        },
        {
          uId: reg3.authUserId,
          email: 'jeff.bezossun@gmail.com',
          nameFirst: 'jess',
          nameLast: 'bezos',
          handleStr: 'jessbezos'
        }
      ]
    });
  });
});

////////////////////////////////////////////////////////////////////////

describe('HTTP tests for users/stats/v1', () => {
  describe('Testing Error Cases ', () => {
    test('Correct output1', () => { 

      const reg1 = authRegisterSS('bk@gmail.com', 'validPass98', 'b', 'k');
      const reg2 = authRegisterSS('gary.sun@gmail.com', 'rnadom8', 'gary', 'sun');
      const channel1 = channelsCreateV2SS(reg1.token, 'COMP1531', true);
      const channel2 = channelsCreateV2SS(reg2.token, 'COMP2521', false);
      dmCreateV1SS(reg1.token, [reg1.authUserId, reg2.authUserId])
      messageSendV1SS(reg1.token, channel1.channelId, 'Hi, how are you?')

      const object = usersStatsV1SS(reg1.token);

      expect(object).toStrictEqual({
        channelsExist: [{numChannelsExist: 2, timeStamp: expect.anything}],
        dmsExist: [{numDmsExist: 1, timeStamp: expect.anything}],
        messagesExist: [{messagesExist: 1, timeStamp: expect.anything}],
        utilizationRate: expect.anything
      })

    });

    test('Correct output2', () => { 

      const reg1 = authRegisterSS('bk@gmail.com', 'validPass98', 'b', 'k');
      const reg2 = authRegisterSS('gary.sun@gmail.com', 'rnadom8', 'gary', 'sun');
      const channel1 = channelsCreateV2SS(reg1.token, 'COMP1531', true);
      dmCreateV1SS(reg1.token, [reg1.authUserId, reg2.authUserId])
      messageSendV1SS(reg1.token, channel1.channelId, 'Hi, how are you?')
      messageSendV1SS(reg2.token, channel1.channelId, 'Im good, how are you?')

      const object = usersStatsV1SS(reg1.token);

      expect(object).toStrictEqual({
        channelsExist: [{numChannelsExist: 1, timeStamp: expect.anything}],
        dmsExist: [{numDmsExist: 1, timeStamp: expect.anything}],
        messagesExist: [{messagesExist: 2, timeStamp: expect.anything}],
        utilizationRate: expect.anything
      })

    });
      
  });

})


