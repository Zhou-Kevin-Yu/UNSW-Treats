import request from 'sync-request';
import config from '../config.json';
import os from 'os';

import { wrappedStandupStartServerSide, wrappedStandupActiveServerSide, wrappedStandupSendServerSide } from '../wrapped.standup';

import { authLoginV2ServerSide, authRegisterV2ServerSide } from '../wrapped.auth';

import { channelsCreateV3ServerSide } from '../wrapped.channels';
import { time } from 'console';

const OK = 200;
const port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

describe('/standup/start/v1', () => {
    test('403 error case - invalid token', () => {
        const returnObj = wrappedStandupStartServerSide('invalid token', 1, 1);
        expect(returnObj.statusCode).toBe(403);
    });

    test('400 error case - invalid channelId', () => {
      const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
      const returnObj = wrappedStandupStartServerSide(authToken, -1, 1);
      expect(returnObj.statusCode).toBe(400);
    });

    test('400 error case - invalid length', () => {
      const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
      const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
      const returnObj = wrappedStandupStartServerSide(authToken, channelId, -1);
      expect(returnObj.statusCode).toBe(400);
    });

    test('400 error case - an active standup already exists', () => {
      const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
      const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
      const returnObj = wrappedStandupStartServerSide(authToken, channelId, 1);
      expect(returnObj.statusCode).toBe(OK);
      const returnObj2 = wrappedStandupStartServerSide(authToken, channelId, 1);
      expect(returnObj2.statusCode).toBe(400);
    });

    test('403 error case - channelId is valid, but authUser is not a member of the channel', () => {
      const notInCh = authRegisterV2ServerSide('bestTest@gmail,com', 'password', 'bestTest', 'bestTest').token;
      const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
      const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
      const returnObj = wrappedStandupStartServerSide(notInCh, channelId, 1);
      expect(returnObj.statusCode).toBe(403);
    });

    test('200 success case - channelId is valid, authUser is member of channel, length is valid', () => {
      const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
      const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
      const returnObj = wrappedStandupStartServerSide(authToken, channelId, 1);
      const timeFinish = returnObj.body.timeFinish;
      expect(returnObj.statusCode).toBe(OK);
      const curTime = Math.floor((new Date()).getTime() / 1000);
      expect(timeFinish).toBeGreaterThanOrEqual(curTime);
    });
});

describe('/standup/active/v1', () => {
  test('403 - invalid token', () => {
    const returnObj = wrappedStandupActiveServerSide('invalid token', 1);
    expect(returnObj.statusCode).toBe(403);  
  });
  test('400 error case - channelId does not refer to a valid channel', () => {
    const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
    const returnObj = wrappedStandupActiveServerSide(authToken, -1);
    expect(returnObj.statusCode).toBe(400);
  });

  test('403 error case - channelId is valid, but authUser is not a member of the channel', () => {
    const notInCh = authRegisterV2ServerSide('bestTest@gmail,com', 'password', 'bestTest', 'bestTest').token;
    const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
    const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
    const returnObj = wrappedStandupActiveServerSide(notInCh, channelId);
    expect(returnObj.statusCode).toBe(403);
  });

  test('200 success case - channelId is valid, authUser is member of channel - no active standup', () => {
    const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
    const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
    const returnObj = wrappedStandupActiveServerSide(authToken, channelId);
    expect(returnObj.statusCode).toBe(OK);
    expect(returnObj.body.isActive).toBe(false);
  });

  test('200 success case - channelId is valid, authUser is a member of channel - active standup', () => {
    const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
    const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
    const returnObj = wrappedStandupStartServerSide(authToken, channelId, 5);
    expect(returnObj.statusCode).toBe(OK);
    const returnObj2 = wrappedStandupActiveServerSide(authToken, channelId);
    expect(returnObj2.statusCode).toBe(OK);
    expect(returnObj2.body.isActive).toBe(true);
  });
});

describe('/standup/send/v1', () => {
  test('403 - invalid token', () => {
    const returnObj = wrappedStandupSendServerSide('invalid token', 1, 'test');
    expect(returnObj.statusCode).toBe(403);  
  });

  test('400 error case - channelId does not refer to a valid channel', () => {
    const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
    const returnObj = wrappedStandupSendServerSide(authToken, -1, 'test');
    expect(returnObj.statusCode).toBe(400);
  });

  test('400 error case - length of message is over 1000 characters', () => {
    const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
    const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
    wrappedStandupStartServerSide(authToken, channelId, 1);
    const returnObj = wrappedStandupSendServerSide(authToken, channelId, 'a'.repeat(1001));
    expect(returnObj.statusCode).toBe(400);
  });

  test('400 case - no active standup', () => {
    const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
    const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
    const returnObj = wrappedStandupSendServerSide(authToken, channelId, 'test');
    expect(returnObj.statusCode).toBe(400);
  });

  test('403 error case - channelId is valid, but authUser is not a member of the channel', () => {
    const notInCh = authRegisterV2ServerSide('bestTest@gmail,com', 'password', 'bestTest', 'bestTest').token;
    const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
    const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
    wrappedStandupStartServerSide(authToken, channelId, 1);
    const returnObj = wrappedStandupSendServerSide(notInCh, channelId, 'test');
    expect(returnObj.statusCode).toBe(403);
  });

  test('200 success case - everything is valid', () => {
  const authToken = authRegisterV2ServerSide('test@gmail,com', 'password', 'test', 'test').token;
  const channelId = channelsCreateV3ServerSide(authToken, 'test channel', true).body.channelId;
  wrappedStandupStartServerSide(authToken, channelId, 1);
  const returnObj = wrappedStandupSendServerSide(authToken, channelId, 'a');
  expect(returnObj.statusCode).toBe(OK);
  });
});


