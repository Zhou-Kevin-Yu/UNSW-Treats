import request from 'sync-request';
import config from '../config.json';
import os from 'os';
import { authRegisterV2ServerSide } from '../wrapped.auth';
import { channelsCreateV2SS } from '../wrapped.channels';
import { channelMessagesV2SS, channelJoinV2SS } from '../wrapped.channel';
import { messageSendV1SS, messageEditV1SS, messageSendDmV1SS, messageRemoveV1SS } from '../wrapped.message';
import { dmCreateV1SS, dmMessagesV1SS } from '../wrapped.dm';
import { messageSendV2SS/*, messageSendDmV2SS ,messageEditV2SS, messageRemoveV2SS */ } from '../wrapped.message';
import { messageShareV1SS, messageReactV1SS, messageUnreactV1SS, messagePinV1SS, messageUnpinV1SS/*, messageSendlaterV1SS, messageSendlaterDmV1SS */ } from '../wrapped.message';
import { /* channelMessagesV3SS, */ channelLeaveV2SS } from '../wrapped.channel';

const errorReturn = { error: 'error' };
const aboveMaxLengthMessage = 'HkFmF9IW0tFB7V0Gs08ZpEUbqOtsWUvLdxRmCSqLlsnm2J4SXlcc7aMJ8Mbxk2q24EjdHX6hTyT9FueMIHnJOIwQxBR5v73lePT7I9za4MZrFUNjVmS1V2FuLk2I3gIhVzKMPA1UQ3WEy5Lom3j3y52PA3iXpZNANMAcpBAeHzI7YxACN9cWvC1BktQyVXs6R6EpWKxhHUq3t8CSE7w3TnYBdUvbHO6j7FZt4KosdQrhux8yPxj2MPf5qilJ9ogUIzpO5axsdRwnWnHaT5taMmvZtsJR1abWwnEtrbZhIGXrY3Omt0RvQRGMmqmxAgtDU8YhzZjRJalcNmCbxkUl9PcvUuLrKkAZebQyunxjM9Szw0RAwB7bNMDSIRhBfgpCApue9oRxIJGo0h50eXTDYDl0Kjr1oMDqantYKsji0Ph0wGB0wc1TDr8l41b6Ys2n6Imveo6pFsd8Z55K3ZtRPie8VisqngbmWwRKka6Ca7GZSYqhjzEHUopbmzmC9uJC7PwYszEv5rwkUm9gFw1S5Nx9pnGaU0JiTc7XPZ2F6YJD0Cz7rCXcxR5L1N4T9krZzFYfAqzqq9PDNrKo0awQJReFNDz3qEVxiyIw3DH4GNQaNpTiCtX1qSTidZ1oBLH0XkGtcNiXrPrP44vmQAcCamGJsp0oUaB6uhP0yzrPvenVe3gzQWijnFwpD8vdUzXwmC8FZcixAQ45ek2iziFBtweZ3Qrt9J6E8KRZUmz3rkwvbUIndo0oJXfPyN1toHgqswAAoFimBKZUYJgGb1JwBH4K51hzQebzotV6emZ8T0pXpdAjWC19bE8wAg9IvZgeZRUVG6zP0O9TrigkHCDDAH8cUw02041aJaJOv3qH8Ulc90q9FU5UCZNM8w084Rq199Tlo3jYCcjB2NhORWcf4ldCN29JzC9KGLkBnHMDrrOYl1AtQmM7ARG5fO7rmH91WHN79aSf1HNf000DSdQ8l7wBxrZhvcEFwTTuz5Kk1';
const OK = 200;
const port = config.port;
let url = config.url;
// console.log(os.platform());

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

function clearV1ServerSide() {
  request(
    'DELETE',
    `${url}:${port}/clear/v1`
  );
}

beforeEach(() => {
  clearV1ServerSide();
});
/// //////// ITERATION 3 TESTING ///////////
/*
test('', () => {

    });
*/
describe('Iteration 3 Function Testing', () => {
  describe('Testing /message/share/v1', () => {
    describe('Testing Success Cases', () => {
      test('ChannelToDmShare', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        const message0 = messageSendV2SS(user0.token, channel0.channelId, 'message0');
        const dm0 = dmCreateV1SS(user0.token, [user1.authUserId]);

        // user0 shares message0, which is in channel0, to dm0, a dm they are part of
        const res = JSON.parse(messageShareV1SS(user0.token, message0.messageId, '', -1, dm0.dmId).body as string);
        expect(res.sharedMessageId).toBe(message0.messageId + 1);
      });
    });
    describe('Testing Error Cases', () => {
      test('channelId AND dmId Invalid - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelsCreateV2SS(user0.token, 'channel1', true);
        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');
        // 3 and 2 refer to invaid channels and dms
        const res = messageShareV1SS(user0.token, message0.messageId, '', 3, 2);
        expect(res.statusCode).toBe(400);
      });
      test("Neither channelId nor dmId are '-1' - (channel)", () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        const channel1 = channelsCreateV2SS(user0.token, 'channel1', true);
        const dm0 = dmCreateV1SS(user0.token, [user1.authUserId]);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');
        // dmId and channelId are valid (0 and 0)
        const res = messageShareV1SS(user0.token, message0.messageId, '', channel1.channelId, dm0.dmId);
        expect(res.statusCode).toBe(400);
      });
      test("UserSharesMessage they don't have access to - (channel)", () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        const dm0 = dmCreateV1SS(user0.token, [user1.authUserId]);

        // user1 shares message0, which is in channel0, a channel user1 isnt part of
        const res = messageShareV1SS(user1.token, message0.messageId, '', -1, dm0.dmId);
        expect(res.statusCode).toBe(400);
      });
      test('messageLen > 1000  - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // const channel1 = channelsCreateV2SS(user1.token, 'channel1', true);
        const dm0 = dmCreateV1SS(user0.token, [user1.authUserId]);

        let str = '';
        // 1001-10 because original message is 8 + 2 newline characters
        for (let i = 0; i < 1001 - 10; i++) {
          str = str + 'a';
        }
        expect(str.length).toBe(991);

        // user0 shares a message of length 1001 to dm0 from channel0
        const res = messageShareV1SS(user1.token, message0.messageId, str, -1, dm0.dmId);
        expect(res.statusCode).toBe(400);
      });
      test('UserSharesMessage to channel they dont have access to - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        const channel1 = channelsCreateV2SS(user1.token, 'channel1', true);

        // user0 shares message0, which is in channel0, to channel1, a channel they arent part of
        const res = messageShareV1SS(user0.token, message0.messageId, '', channel1.channelId, -1);
        expect(res.statusCode).toBe(403);
      });
    });
  });

  describe('Testing /message/react/v1', () => {
    describe('Testing Success Cases', () => {
      test('User1 reacts to User0 message  - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user1 reactss to user0's message in channel0
        const res = messageReactV1SS(user1.token, message0.messageId, 1);
        expect(res.body).toStrictEqual({});

        const messages = channelMessagesV2SS(user1.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].reacts[0].reactId).toBe(1);
        expect(messages.messages[0].reacts[0].uIds).toStrictEqual([1]);
        // expect(messages.messages[0].reacts[0].isThisUserReacted).toBe(true);
      });
    });
    describe('Testing Error Cases', () => {
      test('User reacts to message in a channel they are not part of  - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user1  tries to react to message0, a message in channel0, which they arent part of
        const res = messageReactV1SS(user1.token, message0.messageId, 1);
        expect(res.statusCode).toStrictEqual(400);
      });

      test('incorrect reactId  - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user1 reacts 2, an invalid react
        const res = messageReactV1SS(user1.token, message0.messageId, 2);
        expect(res.statusCode).toStrictEqual(400);
      });

      test('User has already reacted  - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user1 reacts to user0's message in channel0
        let res = messageReactV1SS(user1.token, message0.messageId, 1);
        expect(res.body).toStrictEqual({});

        const messages = channelMessagesV2SS(user1.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].reacts[0].reactId).toBe(1);
        expect(messages.messages[0].reacts[0].uIds).toStrictEqual([1]);
        // expect(messages.messages[0].reacts[0].isThisUserReacted).toBe(true);

        // exact same react should fail
        res = messageReactV1SS(user1.token, message0.messageId, 1);
        expect(res.statusCode).toStrictEqual(400);
      });
    });
  });

  describe('Testing /message/unreact/v1', () => {
    describe('Testing Success Cases', () => {
      test('React and unreact to message in a channel - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user1 reacts to user0's message in channel0
        let res = messageReactV1SS(user1.token, message0.messageId, 1);
        expect(res.body).toStrictEqual({});

        let messages = channelMessagesV2SS(user1.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].reacts[0].reactId).toBe(1);
        expect(messages.messages[0].reacts[0].uIds).toStrictEqual([1]);
        // expect(messages.messages[0].reacts[0].isThisUserReacted).toBe(true);

        res = messageUnreactV1SS(user1.token, message0.messageId, 1);
        expect(res.body).toStrictEqual({});

        messages = channelMessagesV2SS(user1.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].reacts[0].reactId).toBe(1);
        expect(messages.messages[0].reacts[0].uIds).toStrictEqual([]);
        // expect(messages.messages[0].reacts[0].isThisUserReacted).toBe(false);
      });
    });
    describe('Testing Error Cases', () => {
      test('React and unreact to message in a channel - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user1 reacts to user0's message in channel0
        messageReactV1SS(user1.token, message0.messageId, 1);

        // user1 leaves channel 0
        channelLeaveV2SS(user1.token, channel0.channelId);

        const res = messageUnreactV1SS(user1.token, message0.messageId, 1);
        expect(res.statusCode).toStrictEqual(400);
      });
      test('invalid reactId - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user1 reacts to user0's message in channel0
        messageReactV1SS(user1.token, message0.messageId, 1);

        // invalid reactId should fail
        const res = messageUnreactV1SS(user1.token, message0.messageId, 2);
        expect(res.statusCode).toStrictEqual(400);
      });
      test('message does not contain a reactId from authUser - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // No react has taken place
        const res = messageUnreactV1SS(user1.token, message0.messageId, 2);
        expect(res.statusCode).toStrictEqual(400);
      });
    });
  });

  describe('Testing /message/pin/v1', () => {
    describe('Testing Success Cases', () => {
      test('success pin case - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user1 pins user0's message in channel0
        const res = messagePinV1SS(user0.token, message0.messageId);
        expect(res.body).toStrictEqual({});

        const messages = channelMessagesV2SS(user1.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].isPinned).toBe(true);
      });
    });
    describe('Testing Error Cases', () => {
      test('message exists in a channel the user is not part of', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        // channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user1.token, channel0.channelId, 'message0');

        // user0 pins user1's message in channel0, but user1 has not joined channel 0 (should fail)
        const res = messagePinV1SS(user0.token, message0.messageId);
        expect(res.statusCode).toStrictEqual(400);
      });

      test('already pinned - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user0 pins user0's message in channel0
        let res = messagePinV1SS(user0.token, message0.messageId);
        expect(res.body).toStrictEqual({});

        const messages = channelMessagesV2SS(user1.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].isPinned).toBe(true);

        res = messagePinV1SS(user0.token, message0.messageId);
        expect(res.statusCode).toStrictEqual(400);
      });

      test('user does not have owner permissions of channel - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user1 does not have owner permissions in channel0
        const res = messagePinV1SS(user1.token, message0.messageId);
        expect(res.statusCode).toStrictEqual(403);
      });
    });
  });
  describe('Testing /message/unpin/v1', () => {
    describe('Testing Success Cases', () => {
      test('successful unpin - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user1.token, channel0.channelId, 'message0');

        // user0 pins message
        let res = messagePinV1SS(user0.token, message0.messageId);
        expect(res.body).toStrictEqual({});

        let messages = channelMessagesV2SS(user1.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].isPinned).toBe(true);

        res = messageUnpinV1SS(user0.token, message0.messageId);
        expect(res.body).toStrictEqual({});

        messages = channelMessagesV2SS(user1.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].isPinned).toBe(false);
      });
    });
    describe('Testing Error Cases', () => {
      test('message exists in channel user is not part of', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        // channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user0.token, channel0.channelId, 'message0');

        // user0 pins message
        let res = messagePinV1SS(user0.token, message0.messageId);
        expect(res.body).toStrictEqual({});

        const messages = channelMessagesV2SS(user0.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].isPinned).toBe(true);

        res = messageUnpinV1SS(user1.token, message0.messageId);
        expect(res.statusCode).toStrictEqual(400);
      });
      test('message not already pinned', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user1.token, channel0.channelId, 'message0');

        // user0 tries to unpin message message that isn't already pinned
        const res = messageUnpinV1SS(user0.token, message0.messageId);
        expect(res.statusCode).toStrictEqual(400);
      });
      test('user does not have perms to unpin - (channel)', () => {
        const user0 = authRegisterV2ServerSide('u0@gmail.com', 'passworD67', 'u', '0');
        const user1 = authRegisterV2ServerSide('u1@gmail.com', 'passworD67', 'u', '1');
        const channel0 = channelsCreateV2SS(user0.token, 'channel0', true);
        channelJoinV2SS(user1.token, channel0.channelId);

        const message0 = messageSendV1SS(user1.token, channel0.channelId, 'message0');

        // user0 pins message
        let res = messagePinV1SS(user0.token, message0.messageId);
        expect(res.body).toStrictEqual({});

        const messages = channelMessagesV2SS(user1.token, channel0.channelId, 0);
        expect(messages.messages[0].messageId).toBe(message0.messageId);
        expect(messages.messages[0].isPinned).toBe(true);

        res = messageUnpinV1SS(user1.token, message0.messageId);
        expect(res.statusCode).toStrictEqual(403);
      });
    });
  });
/*

  describe('Testing /message/sendlater/v1', () => {
    describe('Testing Success Cases', () => {
      test('', () => {

      });
    });
    describe('Testing Error Cases', () => {
      test('', () => {

      });
    });
  });

  describe('Testing /message/sendlaterDm/v1', () => {
    describe('Testing Success Cases', () => {
      test('', () => {

      });
    });
    describe('Testing Error Cases', () => {
      test('', () => {

      });
    });
  });
*/
});

/// //////// ITERATION 2 TESTING ///////////

describe('Testing iteration 2 Errors', () => {
  describe('message/edit', () => {
    test('local - testOGPosterCanEditMessage (channels)', () => {
      authRegisterV2ServerSide('admin@gmail.com', 'thisPass68', 'admin', 'user');
      const user1 = authRegisterV2ServerSide('bk@gmail.com', 'thisPass68', 'b', 'k');
      // const user2 = authRegisterV2ServerSide("et@gmail.com", "thisPass68", "e", "t");
      const channel1 = channelsCreateV2SS(user1.token, 'Channel1', true);

      const msg0 = messageSendV1SS(user1.token, channel1.channelId, 'message 0');
      let chMsgs = channelMessagesV2SS(user1.token, channel1.channelId, 0);
      expect(chMsgs.messages[0].message).toStrictEqual('message 0');
      messageEditV1SS(user1.token, msg0.messageId, 'hi');
      chMsgs = channelMessagesV2SS(user1.token, channel1.channelId, 0);

      expect(chMsgs.messages[0].message).toStrictEqual('hi');
      expect(chMsgs.start).toBe(0);
      expect(chMsgs.end).toBe(-1);
    });

    test('local - testOGPosterCanEditMessage (dms)', () => {
      const user1 = authRegisterV2ServerSide('bk@gmail.com', 'thisPass68', 'b', 'k');
      const user2 = authRegisterV2ServerSide('et@gmail.com', 'thisPass68', 'e', 't');

      const dm1 = dmCreateV1SS(user1.token, [user2.authUserId]);

      const msg0 = messageSendDmV1SS(user1.token, dm1.dmId, 'message 0');

      let chMsgs = dmMessagesV1SS(user1.token, dm1.dmId, 0);

      expect(chMsgs.messages[0].message).toStrictEqual('message 0');
      messageEditV1SS(user1.token, msg0.messageId, 'hi');

      chMsgs = dmMessagesV1SS(user2.token, dm1.dmId, 0);

      expect(chMsgs.messages[0].message).toStrictEqual('hi');
      expect(chMsgs.start).toBe(0);
      expect(chMsgs.end).toBe(-1);
    });
    describe('message/remove', () => {
      test('local - testOriginalPosterCanRemoveMessage (channels)', () => {
        authRegisterV2ServerSide('admin@gmail.com', 'thisPass68', 'admin', 'user');
        const user1 = authRegisterV2ServerSide('bk@gmail.com', 'thisPass68', 'b', 'k');
        // const user2 = authRegisterV2ServerSide("et@gmail.com", "thisPass68", "e", "t");
        const channel1 = channelsCreateV2SS(user1.token, 'Channel1', true);

        const msg0 = messageSendV1SS(user1.token, channel1.channelId, 'message 0');
        let chMsgs = channelMessagesV2SS(user1.token, channel1.channelId, 0);
        expect(chMsgs.messages[0].message).toStrictEqual('message 0');
        messageRemoveV1SS(user1.token, msg0.messageId);
        chMsgs = channelMessagesV2SS(user1.token, channel1.channelId, 0);

        expect(chMsgs.messages).toStrictEqual([]);
        expect(chMsgs.start).toBe(0);
        expect(chMsgs.end).toBe(-1);
      });

      test('local - testCannotRemoveMessage (channels)', () => {
        authRegisterV2ServerSide('admin@gmail.com', 'thisPass68', 'admin', 'user');
        const user1 = authRegisterV2ServerSide('bk@gmail.com', 'thisPass68', 'b', 'k');
        const user2 = authRegisterV2ServerSide('et@gmail.com', 'thisPass68', 'e', 't');
        const channel1 = channelsCreateV2SS(user1.token, 'Channel1', true);
        channelJoinV2SS(user2.token, channel1.channelId);

        const msg0 = messageSendV1SS(user1.token, channel1.channelId, 'message 0');
        let chMsgs = channelMessagesV2SS(user1.token, channel1.channelId, 0);
        expect(chMsgs.messages[0].message).toStrictEqual('message 0');

        expect(messageRemoveV1SS(user2.token, msg0.messageId)).toStrictEqual({ error: 'error' });
        chMsgs = channelMessagesV2SS(user1.token, channel1.channelId, 0);

        expect(chMsgs.messages[0].message).toStrictEqual('message 0');
        expect(chMsgs.start).toBe(0);
        expect(chMsgs.end).toBe(-1);
      });
    });
  });
});

// HTTP testing for a combination of message functions being used
describe('IITERATION 1 and 2 TESTING', () => {
  describe('HTTP tests using multiple message functions', () => {
  // Success testing for message in channel where functions are used again after remove
    test('Remove a message in channel and then see if /send, /edit and /remove still works', () => {
    // Create a token from authRegisterV2
      const res1 = request(
        'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'kevinyu@email.com',
          password: 'KevinsPassword0',
          nameFirst: 'Kevin',
          nameLast: 'Yu',
        }
      }
      );
      const registerObj = JSON.parse(res1.getBody() as string);
      const token = registerObj.token;
      // Create a channel Id from channelsCreateV2
      const res2 = request(
        'POST',
      `${url}:${port}/channels/create/v2`,
      {
        json: {
          token: token,
          name: 'COMP1531',
          isPublic: true,
        }
      }
      );
      const channelObj = JSON.parse(res2.getBody() as string);
      const channelId = channelObj.channelId;

      // Create a messageId from messageSendV1
      const res3 = request(
        'POST',
      `${url}:${port}/message/send/v1`,
      {
        json: {
          token: token,
          channelId: channelId,
          message: 'I love COMP1531',
        }
      }
      );
      const message1Obj = JSON.parse(res3.getBody() as string);
      const messageId = message1Obj.messageId;

      // The user removes message
      const res4 = request(
        'DELETE',
      `${url}:${port}/message/remove/v1`,
      {
        qs: {
          token: token,
          messageId: messageId,
        }
      }
      );
      const data = JSON.parse(res4.getBody() as string);
      expect(res4.statusCode).toBe(OK);
      // Expect to return empty object
      expect(data).toStrictEqual({ });

      // The user sends another message
      const res5 = request(
        'POST',
      `${url}:${port}/message/send/v1`,
      {
        json: {
          token: token,
          channelId: channelId,
          message: 'I do not like engineering',
        }
      }
      );
      const message2Obj = JSON.parse(res5.getBody() as string);
      const messageId2 = message2Obj.messageId;
      const data2 = JSON.parse(res5.getBody() as string);

      expect(res5.statusCode).toBe(OK);
      // Expect to return message Id
      expect(data2).toStrictEqual({ messageId: expect.any(Number) });
      expect(data2.messageId).toBe(1); // second message ever sent should have the messageId : 1;

      // The user edits the just sent message (second message ever sent)
      const res6 = request(
        'PUT',
      `${url}:${port}/message/edit/v1`,
      {
        json: {
          token: token,
          messageId: messageId2,
          message: 'I love engineering!',
        }
      }
      );
      const data3 = JSON.parse(res6.getBody() as string);
      expect(res6.statusCode).toBe(OK);
      // Expect to return empty object
      expect(data3).toStrictEqual({ });

      // The user then removes just edited message (second message ever sent)
      const res7 = request(
        'DELETE',
      `${url}:${port}/message/remove/v1`,
      {
        qs: {
          token: token,
          messageId: messageId2,
        }
      }
      );
      const data4 = JSON.parse(res7.getBody() as string);
      expect(res7.statusCode).toBe(OK);
      // Expect to return empty object
      expect(data4).toStrictEqual({ });
    });

    // Success testing for message in DM where functions are used again after remove
    test('Remove a message in DM and then see if /sendDM, /edit and /remove still works', () => {
    // Create a token from authRegisterV2
      const res1 = request(
        'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'kevinyu@email.com',
          password: 'KevinsPassword0',
          nameFirst: 'Kevin',
          nameLast: 'Yu',
        }
      }
      );
      const registerObj = JSON.parse(res1.getBody() as string);
      const firstToken = registerObj.token;

      // Create a second user from authRegisterV2
      const res2 = request(
        'POST',
      `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'user@gmail.com',
          password: 'abcdefg',
          nameFirst: 'Calvin',
          nameLast: 'Xu',
        }
      }
      );
      const register2Obj = JSON.parse(res2.getBody() as string);
      const secondUser = [register2Obj.authUserId];

      // Create a dm Id from dm/create/v1
      const dmRes = request(
        'POST',
      `${url}:${port}/dm/create/v1`,
      {
        json: {
          token: firstToken,
          uIds: secondUser,
        }
      }
      );
      const dmObj = JSON.parse(dmRes.getBody() as string);
      const dmId = dmObj.dmId;

      // Send a message from authorisedUser to the DM specified by dmId
      const res3 = request(
        'POST',
      `${url}:${port}/message/senddm/v1`,
      {
        json: {
          token: firstToken,
          dmId: dmId,
          message: 'Hi everyone GLHF',
        }
      }
      );
      const data = JSON.parse(res3.getBody() as string);
      const messageObj = JSON.parse(res3.getBody() as string);
      const messageId = messageObj.messageId;

      expect(res3.statusCode).toBe(OK);
      // Expect to return messageId
      expect(data).toStrictEqual({ messageId: expect.any(Number) });
      expect(data.messageId).toBe(0); // first message should have the messageId : 0;

      // The user removes message sent in DM
      const res4 = request(
        'DELETE',
      `${url}:${port}/message/remove/v1`,
      {
        qs: {
          token: firstToken,
          messageId: messageId,
        }
      }
      );
      const data2 = JSON.parse(res4.getBody() as string);
      expect(res4.statusCode).toBe(OK);
      // Expect to return empty object
      expect(data2).toStrictEqual({ });

      // The user sends another message (second message ever)
      const res5 = request(
        'POST',
      `${url}:${port}/message/senddm/v1`,
      {
        json: {
          token: firstToken,
          dmId: dmId,
          message: 'Good luck',
        }
      }
      );
      const data3 = JSON.parse(res5.getBody() as string);
      const message2Obj = JSON.parse(res5.getBody() as string);
      const messageId2 = message2Obj.messageId;

      expect(res5.statusCode).toBe(OK);
      // Expect to return messageId
      expect(data3).toStrictEqual({ messageId: expect.any(Number) });
      expect(data3.messageId).toBe(1); // second message should have the messageId : 1;

      // The user edits the just sent message (second message ever sent)
      const res6 = request(
        'PUT',
      `${url}:${port}/message/edit/v1`,
      {
        json: {
          token: firstToken,
          messageId: messageId2,
          message: 'Bad luck to everyone!',
        }
      }
      );
      const data4 = JSON.parse(res6.getBody() as string);
      expect(res6.statusCode).toBe(OK);
      // Expect to return empty object
      expect(data4).toStrictEqual({ });

      // The user then removes just edited message (second message ever sent)
      const res7 = request(
        'DELETE',
      `${url}:${port}/message/remove/v1`,
      {
        qs: {
          token: firstToken,
          messageId: messageId2,
        }
      }
      );
      const data5 = JSON.parse(res7.getBody() as string);
      expect(res7.statusCode).toBe(OK);
      // Expect to return empty object
      expect(data5).toStrictEqual({ });
    });

    // // Error test for where user sends message in channel, removes it, and if user trys to edit and remove deleted message
    // test('Error test where user tries to edit and remove deleted channel message', () => {
    //   // Create a token from authRegisterV2
    //   const res1 = request(
    //     'POST',
    //     `${url}:${port}/auth/register/v3`,
    //     {
    //       json: {
    //         email: 'kevinyu@email.com',
    //         password: 'KevinsPassword0',
    //         nameFirst: 'Kevin',
    //         nameLast: 'Yu',
    //       }
    //     }
    //   );
    //   const registerObj = JSON.parse(res1.getBody() as string);
    //   const token = registerObj.token;
    //   // Create a channel Id from channelsCreateV2
    //   const res2 = request(
    //     'POST',
    //     `${url}:${port}/channels/create/v2`,
    //     {
    //       json: {
    //         token: token,
    //         name: 'COMP1531',
    //         isPublic: true,
    //       }
    //     }
    //   );
    //   const channelObj = JSON.parse(res2.getBody() as string);
    //   const channelId = channelObj.channelId;

    //   // Create a messageId from messageSendV1
    //   const res3 = request(
    //     'POST',
    //     `${url}:${port}/message/send/v1`,
    //     {
    //       json: {
    //         token: token,
    //         channelId: channelId,
    //         message: 'I love COMP1531',
    //       }
    //     }
    //   );
    //   const message1Obj = JSON.parse(res3.getBody() as string);
    //   const messageId = message1Obj.messageId;

    //   // The user removes message
    //   const res4 = request(
    //     'DELETE',
    //     `${url}:${port}/message/remove/v1`,
    //     {
    //       qs: {
    //         token: token,
    //         messageId: messageId,
    //       }
    //     }
    //   );
    //   const data = JSON.parse(res4.getBody() as string);
    //   expect(res4.statusCode).toBe(OK);
    //   // Expect to return empty object
    //   expect(data).toStrictEqual({ });

    //   // The user edits the just deleted message (first message ever sent)
    //   const res6 = request(
    //     'PUT',
    //     `${url}:${port}/message/edit/v1`,
    //     {
    //       json: {
    //         token: token,
    //         messageId: messageId,
    //         message: 'I love engineering!',
    //       }
    //     }
    //   );
    //   const data3 = JSON.parse(res6.getBody() as string);
    //   expect(res6.statusCode).toBe(OK);
    //   // Expect to return error
    //   expect(data3).toStrictEqual(errorReturn);

    //   // The user removes the just deleted message (first message ever sent)
    //   const res7 = request(
    //     'DELETE',
    //     `${url}:${port}/message/remove/v1`,
    //     {
    //       qs: {
    //         token: token,
    //         messageId: messageId,
    //       }
    //     }
    //   );
    //   const data4 = JSON.parse(res7.getBody() as string);
    //   expect(res7.statusCode).toBe(OK);
    //   // Expect to return error
    //   expect(data4).toStrictEqual(errorReturn);
    // });

    // // Error test for where user sends message in DM, removes it, and if user trys to edit and remove deleted message
    // test('Error test where user tries to edit and remove deleted DM message', () => {
    //   // Create a token from authRegisterV2
    //   const res1 = request(
    //     'POST',
    //     `${url}:${port}/auth/register/v3`,
    //     {
    //       json: {
    //         email: 'kevinyu@email.com',
    //         password: 'KevinsPassword0',
    //         nameFirst: 'Kevin',
    //         nameLast: 'Yu',
    //       }
    //     }
    //   );
    //   const registerObj = JSON.parse(res1.getBody() as string);
    //   const firstToken = registerObj.token;

    //   // Create a second user from authRegisterV2
    //   const res2 = request(
    //     'POST',
    //     `${url}:${port}/auth/register/v3`,
    //     {
    //       json: {
    //         email: 'user@gmail.com',
    //         password: 'abcdefg',
    //         nameFirst: 'Calvin',
    //         nameLast: 'Xu',
    //       }
    //     }
    //   );
    //   const register2Obj = JSON.parse(res2.getBody() as string);
    //   const secondUser = [register2Obj.authUserId];

    //   // Create a dm Id from dm/create/v1
    //   const dmRes = request(
    //     'POST',
    //     `${url}:${port}/dm/create/v1`,
    //     {
    //       json: {
    //         token: firstToken,
    //         uIds: secondUser,
    //       }
    //     }
    //   );
    //   const dmObj = JSON.parse(dmRes.getBody() as string);
    //   const dmId = dmObj.dmId;

    //   // Send a message from authorisedUser to the DM specified by dmId
    //   const res3 = request(
    //     'POST',
    //     `${url}:${port}/message/senddm/v1`,
    //     {
    //       json: {
    //         token: firstToken,
    //         dmId: dmId,
    //         message: 'Hi everyone GLHF',
    //       }
    //     }
    //   );
    //   const data = JSON.parse(res3.getBody() as string);
    //   const messageObj = JSON.parse(res3.getBody() as string);
    //   const messageId = messageObj.messageId;

    //   expect(res3.statusCode).toBe(OK);
    //   // Expect to return messageId
    //   expect(data).toStrictEqual({ messageId: expect.any(Number) });
    //   expect(data.messageId).toBe(0); // first message should have the messageId : 0;

    //   // The user removes message sent in DM
    //   const res4 = request(
    //     'DELETE',
    //     `${url}:${port}/message/remove/v1`,
    //     {
    //       qs: {
    //         token: firstToken,
    //         messageId: messageId,
    //       }
    //     }
    //   );
    //   const data2 = JSON.parse(res4.getBody() as string);
    //   expect(res4.statusCode).toBe(OK);
    //   // Expect to return empty object
    //   expect(data2).toStrictEqual({ });

    //   // The user edits the just deleted message (first message ever sent)
    //   const res6 = request(
    //     'PUT',
    //     `${url}:${port}/message/edit/v1`,
    //     {
    //       json: {
    //         token: firstToken,
    //         messageId: messageId,
    //         message: 'Bad luck to everyone!',
    //       }
    //     }
    //   );
    //   const data4 = JSON.parse(res6.getBody() as string);
    //   expect(res6.statusCode).toBe(OK);
    //   // Expect to return error
    //   expect(data4).toStrictEqual(errorReturn);

  //   // The user then removes the just deleted message (first message ever sent)
  //   const res7 = request(
  //     'DELETE',
  //     `${url}:${port}/message/remove/v1`,
  //     {
  //       qs: {
  //         token: firstToken,
  //         messageId: messageId,
  //       }
  //     }
  //   );
  //   const data5 = JSON.parse(res7.getBody() as string);
  //   expect(res7.statusCode).toBe(OK);
  //   // Expect to return error
  //   expect(data5).toStrictEqual(errorReturn);
  // });
  });

  // HTTP testing for message/send/v1
  describe('HTTP tests for message/send', () => {
  // If messageSendV1 is successful
    describe('Testing successful messageSendV1', () => {
    // Success case where is sending one message
      test('Test valid sending of message', () => {
      // Create a token from authRegisterV2
        let res = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res.getBody() as string);
        const token = registerObj.token;
        // Create a channel Id from channelsCreateV2
        res = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: token,
            name: 'COMP1531',
            isPublic: true,
          }
        }
        );
        const channelObj = JSON.parse(res.getBody() as string);
        const channelId = channelObj.channelId;
        // Create a messageId from messageSendV1
        res = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'hello world',
          }
        }
        );
        const data = JSON.parse(res.getBody() as string);
        expect(res.statusCode).toBe(OK);
        // Expect to return messageId
        expect(data).toStrictEqual({ messageId: expect.any(Number) });
        expect(data.messageId).toBe(0); // first message should have the messageId : 0;
      });

      // Success case where sending two messages
      test('Test valid sending of TWO messages', () => {
      // Create a token from authRegisterV2
        let res = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res.getBody() as string);
        const token = registerObj.token;
        // Create a channel Id from channelsCreateV2
        res = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: token,
            name: 'COMP1531',
            isPublic: true,
          }
        }
        );
        const channelObj = JSON.parse(res.getBody() as string);
        const channelId = channelObj.channelId;
        // Create a messageId from messageSendV1
        res = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'hello world',
          }
        }
        );
        const data = JSON.parse(res.getBody() as string);
        expect(res.statusCode).toBe(OK);
        // Expect to return messageId
        expect(data).toStrictEqual({ messageId: expect.any(Number) });
        expect(data.messageId).toBe(0); // first message should have the messageId : 0;

        // Send another message to the same channel using messageSendV1
        const res1 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'How is the whole world?',
          }
        }
        );
        const data1 = JSON.parse(res1.getBody() as string);
        expect(res1.statusCode).toBe(OK);
        // Expect to return messageId
        expect(data1).toStrictEqual({ messageId: expect.any(Number) });
        expect(data1.messageId).toBe(1); // second message should have the messageId : 1;
      });
    // Add more success tests later
    });

    // If messageSendV1 returns an error
    describe('Testing error cases for message/send', () => {
    // If the channelId does not refer to a valid channel
      describe('Testing invalid channelId', () => {
        test('Test undefined channelId', () => {
        // Create a token from authRegisterV2
          let res = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'bob@email.com',
              password: 'BobsPassword',
              nameFirst: 'Bob',
              nameLast: 'Smith',
            }
          }
          );
          const registerObj = JSON.parse(res.getBody() as string);
          const token = registerObj.token;
          // Create a messageId from messageSendV1
          res = request(
            'POST',
          `${url}:${port}/message/send/v1`,
          {
            json: {
              token: token,
              channelId: undefined,
              message: 'My name is Manav',
            }
          }
          );
          const data = JSON.parse(res.getBody() as string);
          expect(res.statusCode).toBe(OK);
          // Expect to return error
          expect(data).toStrictEqual(errorReturn);
        });

        test('Test null channelId', () => {
        // Create a token from authRegisterV2
          let res = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'gary.sun@student.unsw.edu.au',
              password: '1b2#$X',
              nameFirst: 'Gary',
              nameLast: 'Sun',
            }
          }
          );
          const registerObj = JSON.parse(res.getBody() as string);
          const token = registerObj.token;
          // Create a messageId from messageSendV1
          res = request(
            'POST',
          `${url}:${port}/message/send/v1`,
          {
            json: {
              token: token,
              channelId: null,
              message: 'I am Etkin',
            }
          }
          );
          const data = JSON.parse(res.getBody() as string);
          expect(res.statusCode).toBe(OK);
          // Expect to return error
          expect(data).toStrictEqual(errorReturn);
        });

        // If channelId is invalid
        test('Test invalid channelId', () => {
        // Create a token from authRegisterV2
          let res = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'kevinyu@email.com',
              password: 'KevinsPassword0',
              nameFirst: 'Kevin',
              nameLast: 'Yu',
            }
          }
          );
          const registerObj = JSON.parse(res.getBody() as string);
          const token = registerObj.token;
          // Create a channel Id from channelsCreateV2
          res = request(
            'POST',
          `${url}:${port}/channels/create/v2`,
          {
            json: {
              token: token,
              name: 'COMP1531',
              isPublic: true,
            }
          }
          );
          const channelObj = JSON.parse(res.getBody() as string);
          const channelId = channelObj.channelId;
          // Create a messageId from messageSendV1
          res = request(
            'POST',
          `${url}:${port}/message/send/v1`,
          {
            json: {
              token: token,
              channelId: channelId + 1,
              message: 'hello world',
            }
          }
          );
          const data = JSON.parse(res.getBody() as string);
          expect(res.statusCode).toBe(OK);
          // Expect to return error
          expect(data).toStrictEqual(errorReturn);
        });

      // Add more invalid channelId error cases later
      });

      // If the length of message is less than 1 or over 1000 characters
      describe('Testing invalid message lengths', () => {
        test('Test if length of message is less than 1 character', () => {
        // Create a token from authRegisterV2
          let res = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'ben.kerno@gmail.com',
              password: 'dogIsCute',
              nameFirst: 'Benjamin',
              nameLast: 'Kernohan',
            }
          }
          );
          const registerObj = JSON.parse(res.getBody() as string);
          const token = registerObj.token;
          // Create a channel Id from channelsCreateV2
          res = request(
            'POST',
          `${url}:${port}/channels/create/v2`,
          {
            json: {
              token: token,
              name: 'COMP1521',
              isPublic: false,
            }
          }
          );
          const channelObj = JSON.parse(res.getBody() as string);
          const channelId = channelObj.channelId;
          // Create a messageId from messageSendV1
          res = request(
            'POST',
          `${url}:${port}/message/send/v1`,
          {
            json: {
              token: token,
              channelId: channelId,
              message: '',
            }
          }
          );
          const data = JSON.parse(res.getBody() as string);
          expect(res.statusCode).toBe(OK);
          // Expect to return error
          expect(data).toStrictEqual(errorReturn);
        });

        test('Test if length of message is more than 1000 characters', () => {
        // Create a token from authRegisterV2
          let res = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'student.stu@student.unsw.edu.au',
              password: 'password',
              nameFirst: 'Stud',
              nameLast: 'Studen',
            }
          }
          );
          const registerObj = JSON.parse(res.getBody() as string);
          const token = registerObj.token;
          // Create a channel Id from channelsCreateV2
          res = request(
            'POST',
          `${url}:${port}/channels/create/v2`,
          {
            json: {
              token: token,
              name: 'COMP1511',
              isPublic: true,
            }
          }
          );
          const channelObj = JSON.parse(res.getBody() as string);
          const channelId = channelObj.channelId;
          // Create a messageId from messageSendV1
          res = request(
            'POST',
          `${url}:${port}/message/send/v1`,
          {
            json: {
              token: token,
              channelId: channelId,
              message: aboveMaxLengthMessage,
            }
          }
          );
          const data = JSON.parse(res.getBody() as string);
          expect(res.statusCode).toBe(OK);
          // Expect to return error
          expect(data).toStrictEqual(errorReturn);
        });
      });

      // If the channelId is valid but authorised user is not a member
      test('Test authId that is not a member of the channel', () => {
      // Create a token (authorised user) from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'sen.smith@outlook.com',
            password: 'peanutButter',
            nameFirst: 'ben',
            nameLast: 'smith',
          }
        }
        );
        const register1Obj = JSON.parse(res1.getBody() as string);
        const authToken = register1Obj.token;
        // Create a token (member user) from authRegisterV2
        const res2 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'user@gmail.com',
            password: 'abcdefg',
            nameFirst: 'Calvin',
            nameLast: 'Xu',
          }
        }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const userToken = register2Obj.token;
        // Create a channel Id from channelsCreateV2 but uses the token from the member user
        // Therefore the authorised user is not a member of the channel
        const channelRes = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: userToken,
            name: 'COMP2521',
            isPublic: true,
          }
        }
        );
        const channelObj = JSON.parse(channelRes.getBody() as string);
        const channelId = channelObj.channelId;
        // Create a messageId from messageSendV1 but using authToken so return error
        const res = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: authToken,
            channelId: channelId,
            message: 'I study COMP1531',
          }
        }
        );
        const data = JSON.parse(res.getBody() as string);
        expect(res.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });
    });
  });

  // HTTP testing for message/edit/v1
  describe('HTTP tests for message/edit', () => {
  // If messageEditV1 is successful
    describe('Testing successful messageEditV1', () => {
      test('Test valid edit of message in channel', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res1.getBody() as string);
        const token = registerObj.token;
        // Create a channel Id from channelsCreateV2
        const res2 = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: token,
            name: 'COMP1531',
            isPublic: true,
          }
        }
        );
        const channelObj = JSON.parse(res2.getBody() as string);
        const channelId = channelObj.channelId;

        // Create a messageId from messageSendV1
        const res3 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'I love COMP1531',
          }
        }
        );
        const message1Obj = JSON.parse(res3.getBody() as string);
        const messageId = message1Obj.messageId;

        // The user edits message
        const res4 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: token,
            messageId: messageId,
            message: 'I like COMP1531',
          }
        }
        );
        const data = JSON.parse(res4.getBody() as string);
        expect(res4.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data).toStrictEqual({ });
      });

      // Test for editing of two messages in channel
      test('Test valid edit of two message in channel', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res1.getBody() as string);
        const token = registerObj.token;
        // Create a channel Id from channelsCreateV2
        const res2 = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: token,
            name: 'COMP1531',
            isPublic: true,
          }
        }
        );
        const channelObj = JSON.parse(res2.getBody() as string);
        const channelId = channelObj.channelId;

        // Create a messageId from messageSendV1
        const res3 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'I love COMP1531',
          }
        }
        );
        const message1Obj = JSON.parse(res3.getBody() as string);
        const messageId = message1Obj.messageId;

        // Create a second message Id by sending another message
        const res5 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'I study at USYD',
          }
        }
        );
        const message2Obj = JSON.parse(res5.getBody() as string);
        const messageId2 = message2Obj.messageId;

        // The user edits FIRST message
        const res4 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: token,
            messageId: messageId,
            message: 'I like COMP1531',
          }
        }
        );
        const data = JSON.parse(res4.getBody() as string);
        expect(res4.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data).toStrictEqual({ });

        // The user edits SECOND message
        const res6 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: token,
            messageId: messageId2,
            message: 'I like COMP1531',
          }
        }
        );
        const data2 = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data2).toStrictEqual({ });
      });

      test('Test valid edit of message in DM', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res1.getBody() as string);
        const firstToken = registerObj.token;

        /// Create another token (second user) from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondUser = [register2Obj.authUserId];

        // The first user creates a dm Id from dmCreateV1 and is directed to second user
        const res3 = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: firstToken,
            uIds: secondUser,
          }
        }
        );
        const dmObj = JSON.parse(res3.getBody() as string);
        const dmId = dmObj.dmId;

        // The first user sends a message to the DM
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: firstToken,
            dmId: dmId,
            message: 'Are you Calvin Xu?',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // The first user edits message in DM
        const res6 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: firstToken,
            messageId: messageId,
            message: 'No',
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data).toStrictEqual({ });
      });

      // Test for editing of two messages in DM
      test('Test valid edit of two messages in DM', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res1.getBody() as string);
        const firstToken = registerObj.token;

        /// Create another token (second user) from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondUser = [register2Obj.authUserId];

        // The first user creates a dm Id from dmCreateV1 and is directed to second user
        const res3 = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: firstToken,
            uIds: secondUser,
          }
        }
        );
        const dmObj = JSON.parse(res3.getBody() as string);
        const dmId = dmObj.dmId;

        // The first user sends a message to the DM
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: firstToken,
            dmId: dmId,
            message: 'Are you Calvin Xu?',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // The first user sends a SECOND message to the DM
        const res5 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: firstToken,
            dmId: dmId,
            message: 'Because my name is Spongebob',
          }
        }
        );
        const message2Obj = JSON.parse(res5.getBody() as string);
        const messageId2 = message2Obj.messageId;

        // The first user edits FIRST message in DM
        const res6 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: firstToken,
            messageId: messageId,
            message: 'No',
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data).toStrictEqual({ });

        // The first user edits SECOND message in DM
        const res7 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: firstToken,
            messageId: messageId2,
            message: 'Because my name is Patrick',
          }
        }
        );
        const data2 = JSON.parse(res7.getBody() as string);
        expect(res7.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data2).toStrictEqual({ });
      });

    // Add more success tests later
    });

    // If messageEditV1 return an error
    describe('Testing error cases for message/edit', () => {
    // If the length of message is over 1000 characters
      test('Test if length of message is more than 1000 characters', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'student.stu@student.unsw.edu.au',
              password: 'password',
              nameFirst: 'Stud',
              nameLast: 'Studen',
            }
          }
        );
        const registerObj = JSON.parse(res1.getBody() as string);
        const token = registerObj.token;
        // Create a channel Id from channelsCreateV2
        const res2 = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: token,
            name: 'ECON2206',
            isPublic: true,
          }
        }
        );
        const channelObj = JSON.parse(res2.getBody() as string);
        const channelId = channelObj.channelId;
        // Create a messageId from messageSendV1
        const res3 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'hello world',
          }
        }
        );
        const messageObj = JSON.parse(res3.getBody() as string);
        const messageId = messageObj.messageId;

        // Return error in messageEditV1
        const res = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: token,
            messageId: messageId,
            message: aboveMaxLengthMessage,
          }
        }
        );
        const data = JSON.parse(res.getBody() as string);
        expect(res.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });

      // If messageId does not refer to a valid message within a channel
      // That the authorised user has joined
      test('Test if messageId is invalid within a channel that the auth user is in', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'sen.smith@outlook.com',
              password: 'peanutButter',
              nameFirst: 'ben',
              nameLast: 'smith',
            }
          }
        );
        const register1Obj = JSON.parse(res1.getBody() as string);
        const firstToken = register1Obj.token;

        // The user creates a channel Id from channelsCreateV2
        const res2 = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: firstToken,
            name: 'MATH1231',
            isPublic: true,
          }
        }
        );
        const channel1Obj = JSON.parse(res2.getBody() as string);
        const firstChannelId = channel1Obj.channelId;

        // The user creates a messageId from messageSendV1
        const res4 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: firstToken,
            channelId: firstChannelId,
            message: 'My name is Alex',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // The user tries to edit an invalid message
        const res6 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: firstToken,
            messageId: messageId - 1,
            message: 'My name is Brad',
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });

      // If messageId does not refer to a valid message within DM
      // That the authorised user has joined
      test('Test if messageId is invalid within DM that the auth user is in', () => {
      // Create a token (first user) from authRegisterV2
        const res1 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'sen.smith@outlook.com',
              password: 'peanutButter',
              nameFirst: 'ben',
              nameLast: 'smith',
            }
          }
        );
        const register1Obj = JSON.parse(res1.getBody() as string);
        const firstToken = register1Obj.token;

        // Create another token (second user) from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondUser = [register2Obj.authUserId];

        // The first user creates a dm Id from dmCreateV1 and is directed to second user
        const res3 = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: firstToken,
            uIds: secondUser,
          }
        }
        );
        const dmObj = JSON.parse(res3.getBody() as string);
        const dmId = dmObj.dmId;

        // The first user sends a message to the DM
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: firstToken,
            dmId: dmId,
            message: 'How are you',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // The first user tries to edit an invalid message in DM
        const res6 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: firstToken,
            messageId: messageId + 1,
            message: 'How is everyone',
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });

      // If the message in channel was not sent by the authorised user making the request
      test('Test if message in channel was not sent by the authorised user making the request', () => {
      // Create a token from authRegisterV2
      // First user to sign up is an owner in Treats
      // const res1 = request(
        request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'sen.smith@outlook.com',
              password: 'peanutButter',
              nameFirst: 'ben',
              nameLast: 'smith',
            }
          }
        );
        // const register1Obj = JSON.parse(res1.getBody() as string);
        // const firstToken = register1Obj.token;
        // const firstUser = [register1Obj.authUserId];
        // Create another token from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondToken = register2Obj.token;

        // Create third user from authRegisterV2
        const res5 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'wow@outlook.com',
              password: 'abcdefghi',
              nameFirst: 'Alvin',
              nameLast: 'Chipmunk',
            }
          }
        );
        const register3Obj = JSON.parse(res5.getBody() as string);
        const thirdToken = register3Obj.token;
        // const thirdUser = [register3Obj.authUserId];

        // The second user creates a channel Id from channelsCreateV2
        const res3 = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: secondToken,
            name: 'ECON2101',
            isPublic: true,
          }
        }
        );
        const channel1Obj = JSON.parse(res3.getBody() as string);
        const firstChannelId = channel1Obj.channelId;

        // The second user creates a messageId from messageSendV1
        const res4 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: secondToken,
            channelId: firstChannelId,
            message: 'hello world',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // // The first user joins channel created by second user
        // request(
        //   'POST',
        //   `${url}:${port}/channel/join/v2`,
        //   {
        //     json: {
        //       token: firstToken,
        //       channelId: firstChannelId,
        //     }
        //   }
        // );

        // // The third user joins channel created by second user
        // request(
        //   'POST',
        //   `${url}:${port}/channel/join/v2`,
        //   {
        //     json: {
        //       token: thirdToken,
        //       channelId: firstChannelId,
        //     }
        //   }
        // );

        // Third user tries to edit a valid message but they did not send that message
        // First user is Treats owner so use third user here
        const res6 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: thirdToken,
            messageId: messageId,
            message: 'Hello, the world is round',
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });

      // If the message in DM was not sent by the authorised user making the request
      test('Test if message in DM was not sent by the authorised user making the request', () => {
      // Create a token (first user) from authRegisterV2
        const res1 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'sen.smith@outlook.com',
              password: 'peanutButter',
              nameFirst: 'ben',
              nameLast: 'smith',
            }
          }
        );
        const register1Obj = JSON.parse(res1.getBody() as string);
        const firstToken = register1Obj.token;
        const firstUser = [register1Obj.authUserId];

        // Create another token (second user) from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondToken = register2Obj.token;

        // The second user creates DM and directs it to the first user
        const res3 = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: secondToken,
            uIds: firstUser,
          }
        }
        );
        const dmObj = JSON.parse(res3.getBody() as string);
        const dmId = dmObj.dmId;

        // The second user sends a message to the DM
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: secondToken,
            dmId: dmId,
            message: 'Where you at?',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // The first user tries to edit an second user's message in DM
        // Message was not sent by the authorised user making edit request
        const res6 = request(
          'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: firstToken,
            messageId: messageId,
            message: 'Where are you guys?',
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });

      // // If the authorised user does not have owner permissions in the channel
      // test ('', () => {
      //   // so they dont create channel
      //   // do auth register
      //   // and second person makes channel so is owner
      //   // but this is the same as Test if message in channel was not sent by the authorised user making the request
      // });

    // // If the authorised user does not have owner permissions in the DM
    // test ('', () => {
    //   // For DMs, only the DM creator has owner permissions (not even global owners)
    //   // second user creates DM so is owner
    //   // but this is the same as Test if message in DM was not sent by the authorised user making the request
    // });
    });
  });

  // HTTP testing for message/remove/v1
  describe('HTTP tests for message/remove', () => {
  // If messageRemoveV1 is successful
    describe('Testing successful messageRemoveV1', () => {
      test('Test valid removal of message in channel', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res1.getBody() as string);
        const token = registerObj.token;
        // Create a channel Id from channelsCreateV2
        const res2 = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: token,
            name: 'COMP1531',
            isPublic: true,
          }
        }
        );
        const channelObj = JSON.parse(res2.getBody() as string);
        const channelId = channelObj.channelId;

        // Create a messageId from messageSendV1
        const res3 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'I love COMP1531',
          }
        }
        );
        const message1Obj = JSON.parse(res3.getBody() as string);
        const messageId = message1Obj.messageId;

        // The user removes message
        const res4 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: token,
            messageId: messageId,
          }
        }
        );
        const data = JSON.parse(res4.getBody() as string);
        expect(res4.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data).toStrictEqual({ });
      });

      test('Test valid removal of message in DM', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res1.getBody() as string);
        const firstToken = registerObj.token;

        /// Create another token (second user) from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondUser = [register2Obj.authUserId];

        // The first user creates a dm Id from dmCreateV1 and is directed to second user
        const res3 = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: firstToken,
            uIds: secondUser,
          }
        }
        );
        const dmObj = JSON.parse(res3.getBody() as string);
        const dmId = dmObj.dmId;

        // The first user sends a message to the DM
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: firstToken,
            dmId: dmId,
            message: 'WOW',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // The first user removes message in DM
        const res6 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: firstToken,
            messageId: messageId,
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data).toStrictEqual({ });
      });

      // Test for removal of two messages in channel
      test('Test valid removal of two messages in channel', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res1.getBody() as string);
        const token = registerObj.token;
        // Create a channel Id from channelsCreateV2
        const res2 = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: token,
            name: 'COMP1531',
            isPublic: true,
          }
        }
        );
        const channelObj = JSON.parse(res2.getBody() as string);
        const channelId = channelObj.channelId;

        // Create a messageId from messageSendV1
        const res3 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'I love COMP1531',
          }
        }
        );
        const message1Obj = JSON.parse(res3.getBody() as string);
        const messageId = message1Obj.messageId;

        // Send another message and create another messageId
        const res5 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: token,
            channelId: channelId,
            message: 'I study at UNSW',
          }
        }
        );
        const message2Obj = JSON.parse(res5.getBody() as string);
        const messageId2 = message2Obj.messageId;

        // The user removes first message
        const res4 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: token,
            messageId: messageId,
          }
        }
        );
        const data = JSON.parse(res4.getBody() as string);
        expect(res4.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data).toStrictEqual({ });

        // The user removes second message
        const res6 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: token,
            messageId: messageId2,
          }
        }
        );
        const data2 = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data2).toStrictEqual({ });
      });

      // Test for removal of two messages in DM
      test('Test valid removal of two messages in DM', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res1.getBody() as string);
        const firstToken = registerObj.token;

        /// Create another token (second user) from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondUser = [register2Obj.authUserId];

        // The first user creates a dm Id from dmCreateV1 and is directed to second user
        const res3 = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: firstToken,
            uIds: secondUser,
          }
        }
        );
        const dmObj = JSON.parse(res3.getBody() as string);
        const dmId = dmObj.dmId;

        // The first user sends a message to the DM
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: firstToken,
            dmId: dmId,
            message: 'WOW',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // The first user sends a SECOND message to the DM
        const res5 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: firstToken,
            dmId: dmId,
            message: 'THIS IS THE BEST SUBJECT EVER',
          }
        }
        );
        const message2Obj = JSON.parse(res5.getBody() as string);
        const messageId2 = message2Obj.messageId;

        // The first user removes FIRST message in DM
        const res6 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: firstToken,
            messageId: messageId,
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data).toStrictEqual({ });

        // The first user removes SECOND message in DM
        const res7 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: firstToken,
            messageId: messageId2,
          }
        }
        );
        const data2 = JSON.parse(res7.getBody() as string);
        expect(res7.statusCode).toBe(OK);
        // Expect to return empty object
        expect(data2).toStrictEqual({ });
      });

    // Add more success tests later
    });

    // If messageRemoveV1 return an error
    describe('Testing error cases for message/remove', () => {
    // If messageId does not refer to a valid message within a channel
    // That the authorised user has joined
      test('Test if messageId is invalid within a channel that the auth user is in', () => {
      // Create a token from authRegisterV2
        const res1 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'sen.smith@outlook.com',
              password: 'peanutButter',
              nameFirst: 'ben',
              nameLast: 'smith',
            }
          }
        );
        const register1Obj = JSON.parse(res1.getBody() as string);
        const firstToken = register1Obj.token;

        // The user creates a channel Id from channelsCreateV2
        const res2 = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: firstToken,
            name: 'MATH1231',
            isPublic: true,
          }
        }
        );
        const channel1Obj = JSON.parse(res2.getBody() as string);
        const firstChannelId = channel1Obj.channelId;

        // The user creates a messageId from messageSendV1
        const res4 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: firstToken,
            channelId: firstChannelId,
            message: 'My name is Alex',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // The user tries to edit an invalid message
        const res6 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: firstToken,
            messageId: messageId - 1,
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });

      // If messageId does not refer to a valid message within DM
      // That the authorised user has joined
      test('Test if messageId is invalid within DM that the auth user is in', () => {
      // Create a token (first user) from authRegisterV2
        const res1 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'sen.smith@outlook.com',
              password: 'peanutButter',
              nameFirst: 'ben',
              nameLast: 'smith',
            }
          }
        );
        const register1Obj = JSON.parse(res1.getBody() as string);
        const firstToken = register1Obj.token;

        // Create another token (second user) from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondUser = [register2Obj.authUserId];

        // The first user creates a dm Id from dmCreateV1 and is directed to second user
        const res3 = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: firstToken,
            uIds: secondUser,
          }
        }
        );
        const dmObj = JSON.parse(res3.getBody() as string);
        const dmId = dmObj.dmId;

        // The first user sends a message to the DM
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: firstToken,
            dmId: dmId,
            message: 'I like playing games',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // The first user tries to edit an invalid message in DM
        const res6 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: firstToken,
            messageId: messageId - 1,
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });

      // If the message in channel was not sent by the authorised user making the request
      test('Test if message in channel was not sent by the authorised user making the request', () => {
      // Create a token from authRegisterV2
      // First user is owner so can remove
      // const res1 = request(
        request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'sen.smith@outlook.com',
              password: 'peanutButter',
              nameFirst: 'ben',
              nameLast: 'smith',
            }
          }
        );
        // const register1Obj = JSON.parse(res1.getBody() as string);
        // const firstToken = register1Obj.token;

        // Create another token from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondToken = register2Obj.token;

        // Create third user from authRegisterV2
        const res5 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'wow@outlook.com',
              password: 'abcdefghi',
              nameFirst: 'Alvin',
              nameLast: 'Chipmunk',
            }
          }
        );
        const register3Obj = JSON.parse(res5.getBody() as string);
        const thirdToken = register3Obj.token;

        // The second user creates a channel Id from channelsCreateV2
        const res3 = request(
          'POST',
        `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: secondToken,
            name: 'ECON2101',
            isPublic: true,
          }
        }
        );
        const channel1Obj = JSON.parse(res3.getBody() as string);
        const firstChannelId = channel1Obj.channelId;

        // The second user creates a messageId from messageSendV1
        const res4 = request(
          'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token: secondToken,
            channelId: firstChannelId,
            message: 'hello world',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // // The first user joins channel created by second user
        // request(
        //   'POST',
        //   `${url}:${port}/channel/join/v2`,
        //   {
        //     json: {
        //       token: firstToken,
        //       channelId: firstChannelId,
        //     }
        //   }
        // );

        // // The third user joins channel created by second user
        // request(
        //   'POST',
        //   `${url}:${port}/channel/join/v2`,
        //   {
        //     json: {
        //       token: thirdToken,
        //       channelId: firstChannelId,
        //     }
        //   }
        // );

        // Third user did not send message in channel and can't remove it
        const res6 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: thirdToken,
            messageId: messageId,
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });

      // If the message in DM was not sent by the authorised user making the request
      test('Test if message in DM was not sent by the authorised user making the request', () => {
      // Create a token (first user) from authRegisterV2
        const res1 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'sen.smith@outlook.com',
              password: 'peanutButter',
              nameFirst: 'ben',
              nameLast: 'smith',
            }
          }
        );
        const register1Obj = JSON.parse(res1.getBody() as string);
        const firstToken = register1Obj.token;
        const firstUser = [register1Obj.authUserId];

        // Create another token (second user) from authRegisterV2
        const res2 = request(
          'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondToken = register2Obj.token;

        // The second user creates DM and directs it to the first user
        const res3 = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: secondToken,
            uIds: firstUser,
          }
        }
        );
        const dmObj = JSON.parse(res3.getBody() as string);
        const dmId = dmObj.dmId;

        // The second user sends a message to the DM
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: secondToken,
            dmId: dmId,
            message: 'HEY',
          }
        }
        );
        const message1Obj = JSON.parse(res4.getBody() as string);
        const messageId = message1Obj.messageId;

        // First user did not send message in DM and can't remove it
        const res6 = request(
          'DELETE',
        `${url}:${port}/message/remove/v1`,
        {
          qs: {
            token: firstToken,
            messageId: messageId,
          }
        }
        );
        const data = JSON.parse(res6.getBody() as string);
        expect(res6.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });

      // // If the authorised user does not have owner permissions in the channel
      // test ('', () => {
      // });

    // // If the authorised user does not have owner permissions in the DM
    // test ('', () => {
    // });
    });
  });

  // HTTP testing for message/senddm/v1
  describe('HTTP tests for message/senddm', () => {
  // If messageSendDmV1 is successful
    describe('Testing successful message/senddm', () => {
      test('Test valid sending of messages in DM', () => {
      // Create a token (auth user) from authRegisterV2
        const res = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'kevinyu@email.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu',
          }
        }
        );
        const registerObj = JSON.parse(res.getBody() as string);
        const authToken = registerObj.token;

        // Create a token (member user) from authRegisterV2
        const res2 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'user@gmail.com',
            password: 'abcdefg',
            nameFirst: 'Calvin',
            nameLast: 'Xu',
          }
        }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const secondUser = [register2Obj.authUserId];

        // Create a dm Id from dm/create/v1
        const dmRes = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: authToken,
            uIds: secondUser,
          }
        }
        );
        const dmObj = JSON.parse(dmRes.getBody() as string);
        const dmId = dmObj.dmId;

        // Send a message from authorisedUser to the DM specified by dmId
        const res3 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: authToken,
            dmId: dmId,
            message: 'When are you guys free?',
          }
        }
        );
        const data = JSON.parse(res3.getBody() as string);
        expect(res3.statusCode).toBe(OK);
        // Expect to return messageId
        expect(data).toStrictEqual({ messageId: expect.any(Number) });
        // expect(data).toStrictEqual(expect.any(Number));
        expect(data.messageId).toBe(0); // first message should have the messageId : 0;

        // Send a SECOND message from authorisedUser to the DM specified by dmId
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: authToken,
            dmId: dmId,
            message: 'Because I am free on Monday',
          }
        }
        );
        const data2 = JSON.parse(res4.getBody() as string);
        expect(res4.statusCode).toBe(OK);
        // Expect to return messageId
        expect(data2).toStrictEqual({ messageId: expect.any(Number) });
        // expect(data).toStrictEqual(expect.any(Number));
        expect(data2.messageId).toBe(1); // second message should have the messageId : 1;
      });

      // Sending MULTIPLE messages in DM

    // Add more success tests later
    });

    // If messageSendDmV1 return an error
    describe('Testing error cases for message/senddm', () => {
    // If dmId does not refer to a valid DM
      describe('Testing invalid dmId', () => {
        test('Test undefined dmId', () => {
        // Create a token from authRegisterV2
          const res = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'bob@email.com',
              password: 'BobsPassword',
              nameFirst: 'Bob',
              nameLast: 'Smith',
            }
          }
          );
          const registerObj = JSON.parse(res.getBody() as string);
          const token = registerObj.token;

          // Expect error from message/senddm/v1 since dmId is undefined
          const res2 = request(
            'POST',
          `${url}:${port}/message/senddm/v1`,
          {
            json: {
              token: token,
              dmId: undefined,
              message: 'My name is Manav',
            }
          }
          );
          const data = JSON.parse(res2.getBody() as string);
          expect(res2.statusCode).toBe(OK);
          // Expect to return error
          expect(data).toStrictEqual(errorReturn);
        });

        test('Test invalid dmId', () => {
        // Create a token from authRegisterV2
          const res = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'bob@email.com',
              password: 'BobsPassword',
              nameFirst: 'Bob',
              nameLast: 'Smith',
            }
          }
          );
          const registerObj = JSON.parse(res.getBody() as string);
          const firstToken = registerObj.token;

          // Create another token (second user) from authRegisterV2
          const res1 = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
          );
          const register2Obj = JSON.parse(res1.getBody() as string);
          const secondUser = [register2Obj.authUserId];

          // Create a dm Id from dmCreateV1
          const res2 = request(
            'POST',
          `${url}:${port}/dm/create/v1`,
          {
            json: {
              token: firstToken,
              uIds: secondUser,
            }
          }
          );
          const dmObj = JSON.parse(res2.getBody() as string);
          const dmId = dmObj.dmId;

          // Expect error from message/senddm/v1 since dmId is invalid
          const res3 = request(
            'POST',
          `${url}:${port}/message/senddm/v1`,
          {
            json: {
              token: firstToken,
              dmId: dmId + 1,
              message: 'My name is Manav',
            }
          }
          );
          const data = JSON.parse(res3.getBody() as string);
          expect(res3.statusCode).toBe(OK);
          // Expect to return error
          expect(data).toStrictEqual(errorReturn);
        });

      // Add more invalid dmId error cases later
      });

      // If the length of message is less than 1 or over 1000 characters
      describe('Testing invalid message lengths', () => {
        test('Test if length of message is less than 1 character', () => {
        // Create a token from authRegisterV2
          const res = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'ben.kerno@gmail.com',
              password: 'dogIsCute',
              nameFirst: 'Benjamin',
              nameLast: 'Kernohan',
            }
          }
          );
          const registerObj = JSON.parse(res.getBody() as string);
          const firstToken = registerObj.token;

          // Create another token (second user) from authRegisterV2
          const res1 = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
          );
          const register2Obj = JSON.parse(res1.getBody() as string);
          const secondUser = [register2Obj.authUserId];

          // Create a dm Id from dmCreateV1
          const res2 = request(
            'POST',
          `${url}:${port}/dm/create/v1`,
          {
            json: {
              token: firstToken,
              uIds: secondUser,
            }
          }
          );
          const dmObj = JSON.parse(res2.getBody() as string);
          const dmId = dmObj.dmId;

          // Create a messageId from messageSendDmV1
          const res3 = request(
            'POST',
          `${url}:${port}/message/senddm/v1`,
          {
            json: {
              token: firstToken,
              dmId: dmId,
              message: '',
            }
          }
          );
          const data = JSON.parse(res3.getBody() as string);
          expect(res3.statusCode).toBe(OK);
          // Expect to return error
          expect(data).toStrictEqual(errorReturn);
        });

        test('Test if length of message is more than 1000 characters', () => {
        // Create a token from authRegisterV2
          const res = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'ben.kerno@gmail.com',
              password: 'dogIsCute',
              nameFirst: 'Benjamin',
              nameLast: 'Kernohan',
            }
          }
          );
          const registerObj = JSON.parse(res.getBody() as string);
          const firstToken = registerObj.token;

          // Create another token (second user) from authRegisterV2
          const res1 = request(
            'POST',
          `${url}:${port}/auth/register/v3`,
          {
            json: {
              email: 'user@gmail.com',
              password: 'abcdefg',
              nameFirst: 'Calvin',
              nameLast: 'Xu',
            }
          }
          );
          const register2Obj = JSON.parse(res1.getBody() as string);
          const secondUser = [register2Obj.authUserId];

          // Create a dm Id from dmCreateV1
          const res2 = request(
            'POST',
          `${url}:${port}/dm/create/v1`,
          {
            json: {
              token: firstToken,
              uIds: secondUser,
            }
          }
          );
          const dmObj = JSON.parse(res2.getBody() as string);
          const dmId = dmObj.dmId;

          // Create a messageId from messageSendDmV1
          const res3 = request(
            'POST',
          `${url}:${port}/message/senddm/v1`,
          {
            json: {
              token: firstToken,
              dmId: dmId,
              message: aboveMaxLengthMessage,
            }
          }
          );
          const data = JSON.parse(res3.getBody() as string);
          expect(res3.statusCode).toBe(OK);
          // Expect to return error
          expect(data).toStrictEqual(errorReturn);
        });
      });

      // If dmId is valid and the authorised user is not a member of the DM
      test('Test authId that is not a member of the DM', () => {
      // Create a token (authorised user) from authRegisterV2
        const res1 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'sen.smith@outlook.com',
            password: 'peanutButter',
            nameFirst: 'ben',
            nameLast: 'smith',
          }
        }
        );
        const register1Obj = JSON.parse(res1.getBody() as string);
        const authToken = register1Obj.token;

        // Create a token (member user) from authRegisterV2
        const res2 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'user@gmail.com',
            password: 'abcdefg',
            nameFirst: 'Calvin',
            nameLast: 'Xu',
          }
        }
        );
        const register2Obj = JSON.parse(res2.getBody() as string);
        const userToken = register2Obj.token;

        // Create another token (another member user) from authRegisterV2
        const res3 = request(
          'POST',
        `${url}:${port}/auth/register/v3`,
        {
          json: {
            email: 'hi@gmail.com',
            password: 'abcdefg',
            nameFirst: 'James',
            nameLast: 'Nguyen',
          }
        }
        );
        const register3Obj = JSON.parse(res3.getBody() as string);
        const thirdUser = [register3Obj.authUserId];

        // Create a dm Id from dm/create/v1 but uses the token from the member user
        // Therefore the authorised user is not a member of the DM
        const dmRes = request(
          'POST',
        `${url}:${port}/dm/create/v1`,
        {
          json: {
            token: userToken,
            uIds: thirdUser,
          }
        }
        );
        const dmObj = JSON.parse(dmRes.getBody() as string);
        const dmId = dmObj.dmId;

        // Return error since authorised user is not member of DM
        const res4 = request(
          'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token: authToken,
            dmId: dmId,
            message: 'Hi guys',
          }
        }
        );
        const data = JSON.parse(res4.getBody() as string);
        expect(res4.statusCode).toBe(OK);
        // Expect to return error
        expect(data).toStrictEqual(errorReturn);
      });
    });
  });
});
