import request from 'sync-request';
import config from '../config.json';
import os from 'os';
// import HTTPError from 'http-errors';
import { authRegisterV2ServerSide } from '../wrapped.auth';
import { channelsCreateV2SS } from '../wrapped.channels';
import { channelJoinV2SS } from '../wrapped.channel';
import { messageSendV1SS } from '../wrapped.message';
// import { dmCreateV1SS, dmMessagesV1SS } from '../wrapped.dm';
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
    messageSendV1SS(user1.token, channel1.channelId, `@${user2Obj.user.handleStr} how are you?`);

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

  // success case where notification is for a reacted message in DM

  // success case where notification is for user being added to a channel
});

// have to do a success case each for tagged, reacted message and added to a channel/DM
// three basic cases
// but I need to remember to make a message and then tagged in channel, reacted message in dm, added to a channel/dm in channel
// message/react/v1 for react
// tagged is if @ followed by a handle - message send, create channel, create auth
// added to a channel - channel invite, added to a dm - dm create
// A user should be able to tag themselves.
// A message can contain multiple tags.
// If the same valid tag appears multiple times in one message, the user is only notified once.
