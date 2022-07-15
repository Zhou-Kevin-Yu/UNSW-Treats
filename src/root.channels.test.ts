const request = require('sync-request');
import config from './config.json';
import os from 'os';

const port = config.port;
let url = config.url;
const errorOutput = { error: 'error' };

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach(() => {
  request('DELETE', `${url}:${port}/clear/v1`);
});

describe('HTTP tests channelsCreateV2', () => {
  /*
  test('error output - invalid token to create channel', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });
    expect(res1.statusCode).toBe(200);

    const res = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: 'invalid-token',
        name: 'COMP1531',
        isPublic: true
      }
    });
    expect(res.statusCode).toBe(200);
    const channel = JSON.parse(res.body as string);
    expect(channel).toBe(errorOutput);
  }); */

  test('Testing invalid name inputs - less than 1 character', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });

    const authId = JSON.parse(res1.body as string);
    const res = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: '',
        isPublic: true
      }
    });

    const channel = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(channel).toStrictEqual(errorOutput);
  });

  test('Testing invalid name inputs - more than 20 characters', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });

    const authId = JSON.parse(res1.body as string);

    const res = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: 'asdfghjkasdfghjkasdfghjkasdfghjksdfghj',
        isPublic: true
      }
    });
    const channel = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(channel).toStrictEqual(errorOutput);
  });

  test('no error output', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });

    const authId = JSON.parse(res1.body as string);

    const res2 = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: 'COMP1531',
        isPublic: true
      }
    });

    const channel = JSON.parse(res2.body as string);

    expect(res2.statusCode).toBe(200);
    expect(channel.channelId).toBe(0);

    const res3 = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: 'COMP2521',
        isPublic: false
      }
    }
    );
    // const channel1 = JSON.parse(res3.body as string);
    expect(res3.statusCode).toBe(200);
    expect(channel.channelId).toBe(0);
  });

  test('Testing private channels', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });

    const authId = JSON.parse(res1.body as string);

    const res2 = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: 'COMP5642',
        isPublic: false
      }
    });
    const channel = JSON.parse(res2.body as string);

    const res = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: 'MATH1081',
        isPublic: true
      }
    });
    const channel2 = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(channel.channelId).toBe(0);
    expect(channel2.channelId).toBe(1);
  });
});

describe('HTTP tests channels/listV2', () => {
  // No error output can be tested

  test('No error output - checking if there are no channels', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });

    const authId = JSON.parse(res1.body as string);

    const res = request('GET', `${url}:${port}/channels/list/v2`, {
      qs: {
        token: authId.token,
      }
    });

    expect(res.statusCode).toBe(200);
    const result = JSON.parse(res.body as string);

    expect(result).toStrictEqual({ channels: [] });
  });

  test('No error output - checking if it will only return channel user has joined', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });

    const authId = JSON.parse(res1.body as string);

    const res2 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'jeff.bezos@gmail.com',
        password: 'jesspassword',
        nameFirst: 'jeff',
        nameLast: 'bezos'
      }
    });

    const authId2 = JSON.parse(res2.body as string);

    const res3 = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: 'COMP1531',
        isPublic: true
      }
    });
    const channel = JSON.parse(res3.body as string);
    expect(channel.channelId).toStrictEqual(0);

    const res4 = request('GET', `${url}:${port}/channels/list/v2`, {
      qs: {
        token: authId2.token,
      }
    });

    expect(res4.statusCode).toBe(200);
    const result = JSON.parse(res4.body as string);

    expect(result).toStrictEqual({ channels: [] });

    const res = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId2.token,
        name: 'COMP1521',
        isPublic: true
      }
    });
    const channel2 = JSON.parse(res.body as string);

    let res6 = request('GET', `${url}:${port}/channels/list/v2`, {
      qs: {
        token: authId2.token,
      }
    });

    expect(res.statusCode).toBe(200);
    res6 = JSON.parse(res6.body as string);

    expect(res6).toStrictEqual({
      channels: [
        {
          channelId: channel2.channelId,
          name: 'COMP1521'
        }
      ]
    });
  });

  test('No error output', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });

    const authId = JSON.parse(res1.body as string);

    const res2 = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: 'COMP1531',
        isPublic: true
      }
    }
    );
    const channel = JSON.parse(res2.body as string);

    let res = request('GET', `${url}:${port}/channels/list/v2`, {
      qs: {
        token: authId.token,
      }
    });

    expect(res.statusCode).toBe(200);
    res = JSON.parse(res.body as string);

    expect(res).toStrictEqual(
      {
        channels: [
          {
            channelId: channel.channelId,
            name: 'COMP1531'
          }
        ]
      }
    );
  });

  test('List channels that have been joined and invited to', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });

    const authId1 = JSON.parse(res1.body as string);

    const res2 = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId1.token,
        name: 'COMP1531',
        isPublic: true
      }
    }
    );
    const channel1 = JSON.parse(res2.body as string);
    expect(channel1.channelId).toStrictEqual(0);

    const res3 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'jeff.bezos@gmail.com',
        password: 'jesspassword',
        nameFirst: 'jeff',
        nameLast: 'bezos'
      }
    });

    const authId2 = JSON.parse(res3.body as string);

    const res4 = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId2.token,
        name: 'COMP2521',
        isPublic: true
      }
    });
    const channel2 = JSON.parse(res4.body as string);
    expect(channel2.channelId).toStrictEqual(1);

    const res5 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'randomy.guy@gmail.com',
        password: 'randompassword',
        nameFirst: 'random',
        nameLast: 'guy'
      }
    });

    const authId3 = JSON.parse(res5.body as string);

    const res = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId3.token,
        name: 'COMP2521',
        isPublic: false
      }
    });
    const channel3 = JSON.parse(res.body as string);
    expect(channel3.channelId).toStrictEqual(2);

    // use channel join
    // use channelinvite

    // channel 3 is pivate;
  });
});

describe('HTTP tests channelsListAllV2', () => {
  // No error output can be tested as this function does not return errors

  test('Successful list', () => {
    const res1 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'gary.sun@gmail.com',
        password: 'password',
        nameFirst: 'gary',
        nameLast: 'sun'
      }
    });

    const authId = JSON.parse(res1.body as string);

    let res2 = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: 'COMP1531',
        isPublic: true
      }
    });
    const channel = JSON.parse(res2.body as string);

    res2 = request('POST', `${url}:${port}/auth/register/v2`, {
      json: {
        email: 'jeff.bezos@gmail.com',
        password: 'jesspassword',
        nameFirst: 'jeff',
        nameLast: 'bezos'
      }
    });

    // const authId2 = JSON.parse(res3.body as string);

    const res4 = request('POST', `${url}:${port}/channels/create/v2`, {
      json: {
        token: authId.token,
        name: 'COMP1521',
        isPublic: true
      }
    });
    const channel1 = JSON.parse(res4.body as string);

    const res5 = request('GET', `${url}:${port}/channels/listall/v2`, {
      qs: {
        token: authId.token
      }
    }

    );

    expect(res5.statusCode).toBe(200);
    const result = JSON.parse(res5.body as string);

    expect(result).toStrictEqual(
      {
        channels: [
          {
            channelId: channel.channelId,
            name: 'COMP1531'
          },
          {
            channelId: channel1.channelId,
            name: 'COMP1521'
          }
        ]
      }
    );
  });

  test('Private channels', () => {

    /// /////addd testssssss
  });
});
