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

  // make one test where return one message
  // success case user send message in channel
  // then expect to equal below array for 
  // message id will be 0, uid will be 0, message is message, timeSent will be annoying look at stack overflow
  // reacts is an array and should be empty cos no reacts
  // is pineed is false

});

  // Array of objects, where each object contains types { messageId, uId, message, timeSent, reacts, isPinned  }
  // reacts is Array of objects, where each object contains types { reactId, uIds, isThisUserReacted } where: 
  // reactId is the id of a react
  // uIds is an array of user id's of people who've reacted for that react
  // isThisUserReacted is whether or not the authorised user (user making the request) currently has one of the reacts to this message