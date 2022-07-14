import request from 'sync-request';
import config from './config.json';
import os from 'os';

import { tokenToAuthUserId, isTokenValid } from './token';

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

describe('Testing /auth/login/v2', () => {
  test('Test unsuccessfull login - email not found', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/login/v2`,
            {
              json: {
                email: 'fake@gmail.com',
                password: 'password',
              }
            }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toEqual({ error: 'error' });
  });

  test('Test unsuccessfull login - password incorrect', () => {
    authRegisterServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt');
    const res = request(
      'POST',
            `${url}:${port}/auth/login/v2`,
            {
              json: {
                email: 'ben.kerno4@gmail.com',
                password: 'password',
              }
            }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toEqual({ error: 'error' });
  });

  test('Test successful login', () => {
    // console.log("START OF THIS TEST");
    const authed = authRegisterServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt');
    // console.log(authed);
    const res = request(
      'POST',
            `${url}:${port}/auth/login/v2`,
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

describe('Testing /auth/register/v2', () => {
  test('Test unseccessfull register - email entered is not valid', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v2`,
            {
              json: {
                email: 'benkerno.com',
                password: 'dogIsCute',
                nameFirst: 'benjamin',
                nameLast: 'kernohandome',
              }
            }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toEqual({ error: 'error' });
  });

  test('Test unseccessfull register - email address already exists', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v2`,
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
            `${url}:${port}/auth/register/v2`,
            {
              json: {
                email: 'testuser@gmail',
                password: 'dogIsCute',
                nameFirst: 'benjamin',
                nameLast: 'kernohandome',
              }
            }
    );
    const data = JSON.parse(ress.getBody() as string);
    expect(ress.statusCode).toBe(OK);
    expect(data).toEqual({ error: 'error' });
  });

  test('Test unsuccessfull registered - password len < 6', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v2`,
            {
              json: {
                email: 'testttt@gmail.com',
                password: 'dog',
                nameFirst: 'benjamin',
                nameLast: 'kernohandome',
              }
            }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toEqual({ error: 'error' });
  });

  test('Test unsuccessfull registered - nameFirst len > 50', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v2`,
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
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toEqual({ error: 'error' });
  });

  test('Test unsuccessfull registered - nameLast len < 1 ', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v2`,
            {
              json: {
                email: 'testttt@gmail.com',
                password: 'dogasdfsadfsadf',
                nameFirst: 'sadfasdfasd',
                nameLast: '',
              }
            }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toEqual({ error: 'error' });
  });

  test('Test successful registered', () => {
    const res = request(
      'POST',
            `${url}:${port}/auth/register/v2`,
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

describe('Testing /auth/logout/v1', () => {
  test('Test successful logout', () => {
    const authed = authRegisterServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt');
    const token = authed.token;
    const res = request(
      'POST',
            `${url}:${port}/auth/logout/v1`,
            {
              json: {
                token: token,
              }
            }
    );
    expect(res.statusCode).toBe(OK);
    expect(isTokenValid(token)).toBe(false);
  });
});