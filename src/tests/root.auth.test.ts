import request from 'sync-request';
import config from '../config.json';
import os from 'os';

import { tokenToAuthUserId, isTokenValid } from '../token';

import { authLoginV2ServerSide, authRegisterV2ServerSide } from '../wrapped.auth';
import { userProfileV2ServerSide } from '../wrapped.user';

import { generateResetCode } from '../auth';

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

function authRegisterServerSide(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
          `${url}:${port}/auth/register/v3`,
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

function generateResetCodeServerSide(email: string){
  const res = request(
    'POST',
      `${url}:${port}/test/genToken`,
      {
        json: {
          email,
        }
      }
  );
  const obj = JSON.parse(res.body as string);
  return obj;
}

describe('Testing /auth/login/v3', () => {
  test('Test unsuccessfull login - email not found', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/login/v3`,
            {
              json: {
                email: 'fake@gmail.com',
                password: 'password',
              }
            }
    );
    // const data = JSON.parse(res.getBody() as string);
    // console.log(data);
    expect(res.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });

  test('Test unsuccessfull login - password incorrect', () => {
    authRegisterServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt');
    const res = request(
      'POST',
            `${url}:${port}/auth/login/v3`,
            {
              json: {
                email: 'ben.kerno4@gmail.com',
                password: 'password',
              }
            }
    );
    // const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });

  test('Test successful login', () => {
    // console.log("START OF THIS TEST");
    const authed = authRegisterServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt');
    // console.log(authed);
    const res = request(
      'POST',
            `${url}:${port}/auth/login/v3`,
            {
              json: {
                email: 'ben.kerno4@gmail.com',
                password: 'dogIsCute',
              }
            }
    );
    const data = JSON.parse(res.getBody() as string);
    // console.log("successful login?")
    // console.log(data);
    expect(res.statusCode).toBe(OK);
    expect(data).toEqual({ token: data.token, authUserId: authed.authUserId });
  });
});

describe('Testing /auth/register/v3', () => {
  test('Test unseccessfull register - email entered is not valid', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v3`,
            {
              json: {
                email: 'benkerno.com',
                password: 'dogIsCute',
                nameFirst: 'benjamin',
                nameLast: 'kernohandome',
              }
            }
    );
    // const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });

  test('Test unseccessfull register - email address already exists', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v3`,
            {
              json: {
                email: 'testuser@gmail.com',
                password: 'dogIsCute',
                nameFirst: 'benjamin',
                nameLast: 'kernohandome',
              }
            }
    );
    expect(res.statusCode).toBe(OK);
    const ress = request(
      'POST',
            `${url}:${port}/auth/register/v3`,
            {
              json: {
                email: 'testuser@gmail',
                password: 'dogIsCute',
                nameFirst: 'benjamin',
                nameLast: 'kernohandome',
              }
            }
    );
    // const data = JSON.parse(ress.getBody() as string);
    expect(ress.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });

  test('Test unsuccessfull registered - password len < 6', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v3`,
            {
              json: {
                email: 'testttt@gmail.com',
                password: 'dog',
                nameFirst: 'benjamin',
                nameLast: 'kernohandome',
              }
            }
    );
    // const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });

  test('Test unsuccessfull registered - nameFirst len > 50', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v3`,
            {
              json: {
                email: 'testttt@gmail.com',
                password: 'dogasdfsadfsadf',
                nameFirst: 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm',
                nameLast: 'kernohandome',
              }
            }
    );
    expect('qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm'.length).toBe(52);
    // const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });

  test('Test unsuccessfull registered - nameLast len < 1 ', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v3`,
            {
              json: {
                email: 'testttt@gmail.com',
                password: 'dogasdfsadfsadf',
                nameFirst: 'sadfasdfasd',
                nameLast: '',
              }
            }
    );
    // const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(400);
    // expect(data).toEqual({ error: 'error' });
  });

  test('Test successful registered', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v3`,
            {
              json: {
                email: 'ben.kerno4@gmail.com',
                password: 'dogIsCute',
                nameFirst: 'benjamin',
                nameLast: 'kernohandome',
              }
            }
    );
    const data = JSON.parse(res.getBody() as string);
    // console.log("HERE")
    // console.log(data);
    expect(res.statusCode).toBe(OK);
    const recToken = data.token;
    const recAuthUser = data.authUserId;
    expect(data).toEqual({ token: data.token, authUserId: data.authUserId });
    expect(recAuthUser).toBe(tokenToAuthUserId(recToken, true));
  });
});

describe('Testing /auth/logout/v2', () => {
  test('Test successful logout', () => {
    const authed = authRegisterServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt');
    const token = authed.token;
    const res = request(
      'POST',
            `${url}:${port}/auth/logout/v2`,
            {
              headers: {
                token: token,
              }
            }
    );
    expect(res.statusCode).toBe(OK);
    expect(isTokenValid(token)).toBe(false);
  });
  test('Test unsuccessful logout - token is invalid', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/logout/v2`,
            {
              headers: {
                token: 'invalidtoken',
              }
            }
    );
    expect(res.statusCode).toBe(403);
  });
});

describe('further testing combining login, logout and user', () => {
  test('user1', () => {
    authRegisterServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt');
    const newTok = authLoginV2ServerSide('ben.kerno4@gmail.com', 'dogIsCute');
    const user = userProfileV2ServerSide(newTok.token, 0);
    console.log(user);
    expect(user.user.email).toStrictEqual('ben.kerno4@gmail.com');
  });
});

describe('testing /auth/passwordreset/request/v1 & /auth/passwordreset/reset/v1', () => {
  test('Error Case - reset - resetCode is not valid', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/passwordreset/reset/v1`,
            {
              json: {
                resetCode: 'invalid',
                newPassword: 'ThisIsAPassword',
              }
            }
    );
    expect(res.statusCode).toBe(400);
  });
  test('Error Case - reset - newPassword is not valid', () => {
    authRegisterV2ServerSide('gazza@gmail.com', 'dogIsCute', 'benjamin', 'kernohandome');
    const resetCode = generateResetCodeServerSide('gazza@gmail.com');
    const res = request(
      'POST',
      `${url}:${port}/auth/passwordreset/reset/v1`,
      {
        json: {
          resetCode: resetCode,
          newPassword: 'no',
        }
      }
    );
    expect(res.statusCode).toBe(400);
  });
  test('Success Case', () => {
    authRegisterV2ServerSide('test@gmail.com', 'dogIsCute', 'benjamin', 'kernohandome');
    const resetCode = generateResetCodeServerSide('test@gmail.com');
    console.log('reset code getting added is', resetCode);
    console.log('this is of type', typeof resetCode);
    const res = request(
      'POST',
      `${url}:${port}/auth/passwordreset/reset/v1`,
      {
        json: {
          resetCode: resetCode,
          newPassword: 'MyNewPassword',
        }
      }
    );
    expect(res.statusCode).toBe(OK);
    const resTwo = request(
      'POST',
      `${url}:${port}/auth/login/v3`,
      {
        json: {
          email: 'test@gmail.com',
          password: 'MyNewPassword',
        }
      }
    );
    expect(resTwo.statusCode).toBe(OK);
  });
});
