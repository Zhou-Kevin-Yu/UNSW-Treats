import config from '../config.json';

const request = require('sync-request');

import os from 'os';
import { authRegisterV2ServerSide } from '../wrapped.auth';
import { channelsCreateV2SS } from '../wrapped.channels';
import { channelMessagesV2SS } from '../wrapped.channel';
import { messageSendV1SS } from '../wrapped.message';

// const OK = 200;
const port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach(() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing iteration 2 Errors', () => {
  test('local - testUnderFiftyMessagesSent', () => {
    const user1 = authRegisterV2ServerSide("bk@gmail.com", "thisPass68", "b", "k");
    //const user2 = authRegisterV2ServerSide("et@gmail.com", "thisPass68", "e", "t");
    const channel1 = channelsCreateV2SS(user1.token, "Channel1", true);

    for (let i = 0; i < 30; i++) {
      messageSendV1SS(user1.token, channel1.channelId, `message ${i}`);
    }

    const chMsgs = channelMessagesV2SS(user1.token, channel1.channelId, 0);
    expect(chMsgs.messages.length).toBe(30);
    expect(chMsgs.messages[0].uId).toBe(user1.authUserId);
    expect(chMsgs.messages[25].message).toBe('message 4');
    expect(chMsgs.messages[25].messageId).toBe(4);
    expect(chMsgs.start).toBe(0);
    expect(chMsgs.end).toBe(-1);
  });

  test('local - testOverFiftyMessagesSent', () => {
    const user1 = authRegisterV2ServerSide("bk@gmail.com", "thisPass68", "b", "k");
    //const user2 = authRegisterV2ServerSide("et@gmail.com", "thisPass68", "e", "t");
    const channel1 = channelsCreateV2SS(user1.token, "Channel1", true);

    for (let i = 0; i < 52; i++) {
      messageSendV1SS(user1.token, channel1.channelId, `message ${i}`);
    }

    const chMsgs = channelMessagesV2SS(user1.token, channel1.channelId, 0);
    expect(chMsgs.messages.length).toBe(50);
    expect(chMsgs.messages[0].uId).toBe(user1.authUserId);
    expect(chMsgs.messages[48].message).toBe('message 1');
    expect(chMsgs.messages[48].messageId).toBe(1);
    expect(chMsgs.start).toBe(0);
    expect(chMsgs.end).toBe(50);
  });
});