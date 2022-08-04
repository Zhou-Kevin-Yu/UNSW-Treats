import request from 'sync-request';
import config from '../config.json';
import os from 'os';
// import HTTPError from 'http-errors';
import { authRegisterV2ServerSide } from '../wrapped.auth';
import { channelsCreateV2SS } from '../wrapped.channels';
import { channelJoinV2SS } from '../wrapped.channel';
import { messageReactV1SS, messageSendV2SS, messageSendDmV2SS } from '../wrapped.message';
import { dmCreateV1SS } from '../wrapped.dm';
import { userProfileV2ServerSide } from '../wrapped.user';

const OK = 200;
const port = config.port;
let url = config.url;

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

describe('Testing basic functionality', () => {
  // Tagged message in Channel
  test('success case where notification is for a tagged message in channel', () => {
    // Create users
    const user1 = authRegisterV2ServerSide('admin@gmail.com', 'thisPass68', 'calvin', 'xu');
    const user2 = authRegisterV2ServerSide('et@gmail.com', 'thisPass67', 'e', 't');

    // Create channel
    const channel1 = channelsCreateV2SS(user1.token, 'Channel1', true);

    // User 2 joins Channel1
    channelJoinV2SS(user2.token, channel1.channelId);

    // Retrieve user1's handle
    const user1Obj = userProfileV2ServerSide(user1.token, user1.authUserId);

    // Retrieve user2's handle
    const user2Obj = userProfileV2ServerSide(user2.token, user2.authUserId);

    // User 1 sends a message in Channel1 tagging User 2
    messageSendV2SS(user1.token, channel1.channelId, `@${user2Obj.user.handleStr} how are you?`);

    // Return user2's most recent notifications
    const res = request('GET', `${url}:${port}/notifications/get/v1`, {
      qs: {
        token: user2.token,
      }
    });
    // ask about this
    // const data = JSON.parse(res.getHeader() as string);
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    // Return "notifications" if successful
    expect(data).toStrictEqual({ channelId: 0, dmId: -1, notificationMessage: `${user1Obj.user.handleStr} tagged you in Channel1: how are you?` });
  });

  // Reacted Message in DM
  test('success case where notification is for a reacted message in DM', () => {
    // Create users
    const user1 = authRegisterV2ServerSide('admin@gmail.com', 'thisPass68', 'calvin', 'xu');
    const user2 = authRegisterV2ServerSide('et@gmail.com', 'thisPass67', 'e', 't');

    // Create DM
    const dm1 = dmCreateV1SS(user1.token, [user2.authUserId]);

    // Retrieve user2's handle
    const user2Obj = userProfileV2ServerSide(user2.token, user2.authUserId);

    // User 1 sends a message in DM
    const dmMsg = messageSendDmV2SS(user1.token, dm1.dmId, 'Get well soon!');

    // User 2 reacts to message sent in DM by User 1
    // currently, the only valid react ID the frontend has is 1
    messageReactV1SS(user2.token, dmMsg.messageId, 1);

    // Get details of DM in order to find name
    const res1 = request('GET', `${url}:${port}/dm/details/v1`, {
      qs: {
        token: user1.token,
        dmId: dm1.dmId,
      }
    });
    const dm1Obj = JSON.parse(res1.getBody() as string);

    // Return user1's most recent notifications
    const res = request('GET', `${url}:${port}/notifications/get/v1`, {
      qs: {
        token: user1.token,
      }
    });
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    // Return "notifications" if successful
    expect(data).toStrictEqual({ channelId: -1, dmId: 0, notificationMessage: `${user2Obj.user.handleStr} reacted to your message in ${dm1Obj.name}` });
  });

  // Added to a Channel
  test('success case where notification is for being added to a channel', () => {
    // Create users
    const user1 = authRegisterV2ServerSide('admin@gmail.com', 'thisPass68', 'calvin', 'xu');
    const user2 = authRegisterV2ServerSide('et@gmail.com', 'thisPass67', 'e', 't');

    // Create channel
    const channel1 = channelsCreateV2SS(user1.token, 'COMP1531', true);

    // User 1 invites User 2 to channel COMP1531
    request('POST', `${url}:${port}/channel/invite/v3`, {
      json: {
        token: user1.token,
        channelId: channel1.channelId,
        uId: user2.authUserId,
      }
    });

    // Retrieve user1's handle
    const user1Obj = userProfileV2ServerSide(user1.token, user1.authUserId);

    // Return user2's most recent notifications
    const res = request('GET', `${url}:${port}/notifications/get/v1`, {
      qs: {
        token: user2.token,
      }
    });
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    // Return "notifications" if successful
    expect(data).toStrictEqual({ channelId: 0, dmId: -1, notificationMessage: `${user1Obj.user.handleStr} added you to COMP1531` });
  });
});

// three basic cases each for CHANNEL AND DM
// Edge cases:
// // A user should be able to tag themselves
// // A message can contain multiple tags
// // If the same valid tag appears multiple times in one message, the user is only notified once
