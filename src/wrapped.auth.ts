import request from 'sync-request';
import config from './config.json';
import os from 'os';

import { AuthLoginV1 } from './dataStore';

// const OK = 200;
const port = config.port;
let url = config.url;

// console.log(os.platform());

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

function authLoginV2ServerSide(email: string, password: string) : AuthLoginV1 {
  const res = request(
    'POST',
        `${url}:${port}/auth/login/v2`,
        {
          json: {
            email,
            password,
          }
        }
  );
  return JSON.parse(res.body as string);
}

function authRegisterV2ServerSide(email: string, password: string, nameFirst: string, nameLast: string) : AuthLoginV1 {
  const res = request(
    'POST',
            `${url}:${port}/auth/register/v2`,
            {
              json: {
                email,
                password,
                nameFirst,
                nameLast,
              }
            }
  );
  return JSON.parse(res.body as string);
}

function authLogoutV1ServerSide(token: string) {
  const res = request(
    'POST',
        `${url}:${port}/auth/logout/v1`,
        {
          json: {
            token,
          }
        }
  );
  return JSON.parse(res.body as string);
}

export { authLoginV2ServerSide, authRegisterV2ServerSide, authLogoutV1ServerSide };
