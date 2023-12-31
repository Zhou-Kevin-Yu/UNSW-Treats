import config from '../config.json';

const request = require('sync-request');

import os from 'os';
import { authRegisterV2ServerSide, authLogoutV1ServerSide } from '../wrapped.auth';
import { channelsCreateV2SS } from '../wrapped.channels';
import { channelMessagesV2SS, channelJoinV2SS, channelAddOwnerV1SS, channelRemoveOwnerV1SS, channelDetailsV2SS } from '../wrapped.channel';
import { messageSendV1SS, messageEditV1SS, messageSendDmV1SS } from '../wrapped.message';
import { dmCreateV1SS, dmMessagesV1SS } from '../wrapped.dm';

// const OK = 200;
const port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach(() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing iteration 2 Errors', () => {
  describe('channel/removeOwner', () => {
    test('local - globalOwnerMberCanRemoveOwner', () => {
      const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passwordIs76', 'user', '1');
      const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passwordIs76', 'user', '2');
      const user2 = authRegisterV2ServerSide('u2@gmail.com', 'passwordIs76', 'user', '3');
      const channel0 = channelsCreateV2SS(user1.token, 'channel0', true);
      channelJoinV2SS(user2.token, channel0.channelId);
      channelAddOwnerV1SS(user1.token, channel0.channelId, user2.authUserId);
      // should work
      expect(channelRemoveOwnerV1SS(user0.token, channel0.channelId, user1.authUserId)).toStrictEqual({});
      const channel0Obj = channelDetailsV2SS(user2.token, channel0.channelId);
      expect(channel0Obj.ownerMembers.length).toBe(1);
      expect(channel0Obj.ownerMembers[0].uId).toBe(2);
    });

    test('local - invalidUid', () => {
      const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passwordIs76', 'user', '1');
      const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passwordIs76', 'user', '2');
      const user2 = authRegisterV2ServerSide('u2@gmail.com', 'passwordIs76', 'user', '3');
      const channel0 = channelsCreateV2SS(user1.token, 'channel0', true);
      channelJoinV2SS(user2.token, channel0.channelId);
      channelAddOwnerV1SS(user1.token, channel0.channelId, user2.authUserId);
      // should throw an error
      expect(channelRemoveOwnerV1SS(user0.token, channel0.channelId, -1)).toStrictEqual({ error: 'error' });
    });

    test('local - invalidatedToken', () => {
      // const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passwordIs76', 'user', '1');
      const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passwordIs76', 'user', '2');
      const user2 = authRegisterV2ServerSide('u2@gmail.com', 'passwordIs76', 'user', '3');
      const channel0 = channelsCreateV2SS(user1.token, 'channel0', true);
      channelJoinV2SS(user2.token, channel0.channelId);
      channelAddOwnerV1SS(user1.token, channel0.channelId, user2.authUserId);
      authLogoutV1ServerSide(user2.token);
      // should throw an error
      expect(channelRemoveOwnerV1SS(user2.token, channel0.channelId, user1.authUserId)).toStrictEqual({ error: 'error' });
    });
  });

  describe('channel/messages', () => {
    test('local - testUnderFiftyMessagesSent', () => {
      const user1 = authRegisterV2ServerSide('bk@gmail.com', 'thisPass68', 'b', 'k');
      // const user2 = authRegisterV2ServerSide("et@gmail.com", "thisPass68", "e", "t");
      const channel1 = channelsCreateV2SS(user1.token, 'Channel1', true);

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
      const user1 = authRegisterV2ServerSide('bk@gmail.com', 'thisPass68', 'b', 'k');
      // const user2 = authRegisterV2ServerSide("et@gmail.com", "thisPass68", "e", "t");
      const channel1 = channelsCreateV2SS(user1.token, 'Channel1', true);

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

    test('local - testRemovalByEdit (channels)', () => {
      const user1 = authRegisterV2ServerSide('bk@gmail.com', 'thisPass68', 'b', 'k');
      // const user2 = authRegisterV2ServerSide("et@gmail.com", "thisPass68", "e", "t");
      const channel1 = channelsCreateV2SS(user1.token, 'Channel1', true);

      const msg0 = messageSendV1SS(user1.token, channel1.channelId, 'message 0');
      messageEditV1SS(user1.token, msg0.messageId, '');
      const chMsgs = channelMessagesV2SS(user1.token, channel1.channelId, 0);
      console.log(chMsgs.messages);

      expect(chMsgs.messages).toStrictEqual([]);
      expect(chMsgs.start).toBe(0);
      expect(chMsgs.end).toBe(-1);
    });

    test('local - testRemovalByEdit (dms)', () => {
      const user1 = authRegisterV2ServerSide('bk@gmail.com', 'thisPass68', 'b', 'k');
      const user2 = authRegisterV2ServerSide('et@gmail.com', 'thisPass68', 'e', 't');

      const dm1 = dmCreateV1SS(user1.token, [user2.authUserId]);

      const msg0 = messageSendDmV1SS(user1.token, dm1.dmId, 'message 0');
      messageEditV1SS(user1.token, msg0.messageId, '');
      const chMsgs = dmMessagesV1SS(user1.token, dm1.dmId, 0);

      expect(chMsgs.messages).toStrictEqual([]);
      expect(chMsgs.start).toBe(0);
      expect(chMsgs.end).toBe(-1);
    });
  });
});
