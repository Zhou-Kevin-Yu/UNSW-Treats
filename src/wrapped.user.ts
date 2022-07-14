import request from 'sync-request';
import config from './config.json';
import os from 'os';
import { UserDetailsV1 } from './dataStore';

// const OK = 200;
const port = config.port;
let url = config.url;

// console.log(os.platform());

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

function userProfileV2ServerSide(token: string, uId: number): UserDetailsV1 {
  const res = request(
    'GET',
        `${url}:${port}/user/profile/v2`,
        {
          qs: { token, uId }
        }
  );
    // const data = res.body as string;
  const data = res.body.toString();
  // console.log(data);
  return JSON.parse(data);
}

function userSetnameV1ServerSide(token: string, nameFirst: string, nameLast: string) : { error?: 'error' } {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/setname/v1`,
        {
          json: {
            token,
            nameFirst,
            nameLast,
          }
        }
  );
    // const data = res.body as string;
  const data = res.body.toString();
  // console.log(data);
  return JSON.parse(data);
}

function userSetemailV1ServerSide(token: string, email: string) : { error?: 'error' } {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/setemail/v1`,
        {
          json: {
            token,
            email,
          }
        }
  );
    // const data = res.body as string;
  const data = res.body.toString();
  // console.log(data);
  return JSON.parse(data);
}

function userSethandleV1ServerSide(token: string, handle: string) : { error?: 'error' } {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/sethandle/v1`,
        {
          json: {
            token,
            handle,
          }
        }
  );
    // const data = res.body as string;
  const data = res.body.toString();
  // console.log(data);
  return JSON.parse(data);
}

export { userProfileV2ServerSide, userSetnameV1ServerSide, userSetemailV1ServerSide, userSethandleV1ServerSide };
