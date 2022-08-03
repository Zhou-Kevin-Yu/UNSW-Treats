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

function userSethandleV1ServerSide(token: string, handleStr: string) : { error?: 'error' } {
  const res = request(
    'PUT',
        `${url}:${port}/user/profile/sethandle/v1`,
        {
          json: {
            token,
            handleStr,
          }
        }
  );
    // const data = res.body as string;
  const data = res.body.toString();
  // console.log(data);
  return JSON.parse(data);
}

////////////////////////////////////////////////////////////////////////////////
function userStatsV1SS(token: string) : { error?: 'error' } {
  const res = request(
    'GET',
        `${url}:${port}/user/stats/v1`,
        {
          headers: {token: token}
        }
  );
  const data = res.body.toString();
  return JSON.parse(data);
}

function usersStatsV1SS(token: string) : { error?: 'error' } {
  const res = request(
    'GET',
        `${url}:${port}/users/stats/v1`,
        {
          headers: {token: token}
        }
  );
  const data = res.body.toString();
  return JSON.parse(data);
}

function userProfileUploadPhotoV1SS(token: string, imgUrl: string, xStart: number, xEnd: number, yStart: number, yEnd: number) : { error?: 'error' } {
  const res = request(
    'POST',
        `${url}:${port}/user/profile/uploadphoto/v1`,
        {
          headers: {token: token},
          json: {
            imgUrl: imgUrl,
            xStart: xStart,
            xEnd: xEnd,
            yStart: yStart,
            yEnd: yEnd
          }
        }
  );
  const data = res.body.toString();
  return JSON.parse(data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////
export { userProfileV2ServerSide, userSetnameV1ServerSide, userSetemailV1ServerSide, 
  userSethandleV1ServerSide, userProfileUploadPhotoV1SS, userStatsV1SS, usersStatsV1SS };
