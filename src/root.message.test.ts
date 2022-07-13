// import { messageSendV1 } from './message';
import request from 'sync-request';
import { SERVER_URL } from './config';
import { clearV1 } from './other';
import os from 'os';
// import config from './config.json';
// const { echo } = require('./echo');

const OK = 200;
const errorReturn = { error: 'error' };
const aboveMaxLengthMessage = 'HkFmF9IW0tFB7V0Gs08ZpEUbqOtsWUvLdxRmCSqLlsnm2J4SXlcc7aMJ8Mbxk2q24EjdHX6hTyT9FueMIHnJOIwQxBR5v73lePT7I9za4MZrFUNjVmS1V2FuLk2I3gIhVzKMPA1UQ3WEy5Lom3j3y52PA3iXpZNANMAcpBAeHzI7YxACN9cWvC1BktQyVXs6R6EpWKxhHUq3t8CSE7w3TnYBdUvbHO6j7FZt4KosdQrhux8yPxj2MPf5qilJ9ogUIzpO5axsdRwnWnHaT5taMmvZtsJR1abWwnEtrbZhIGXrY3Omt0RvQRGMmqmxAgtDU8YhzZjRJalcNmCbxkUl9PcvUuLrKkAZebQyunxjM9Szw0RAwB7bNMDSIRhBfgpCApue9oRxIJGo0h50eXTDYDl0Kjr1oMDqantYKsji0Ph0wGB0wc1TDr8l41b6Ys2n6Imveo6pFsd8Z55K3ZtRPie8VisqngbmWwRKka6Ca7GZSYqhjzEHUopbmzmC9uJC7PwYszEv5rwkUm9gFw1S5Nx9pnGaU0JiTc7XPZ2F6YJD0Cz7rCXcxR5L1N4T9krZzFYfAqzqq9PDNrKo0awQJReFNDz3qEVxiyIw3DH4GNQaNpTiCtX1qSTidZ1oBLH0XkGtcNiXrPrP44vmQAcCamGJsp0oUaB6uhP0yzrPvenVe3gzQWijnFwpD8vdUzXwmC8FZcixAQ45ek2iziFBtweZ3Qrt9J6E8KRZUmz3rkwvbUIndo0oJXfPyN1toHgqswAAoFimBKZUYJgGb1JwBH4K51hzQebzotV6emZ8T0pXpdAjWC19bE8wAg9IvZgeZRUVG6zP0O9TrigkHCDDAH8cUw02041aJaJOv3qH8Ulc90q9FU5UCZNM8w084Rq199Tlo3jYCcjB2NhORWcf4ldCN29JzC9KGLkBnHMDrrOYl1AtQmM7ARG5fO7rmH91WHN79aSf1HNf000DSdQ8l7wBxrZhvcEFwTTuz5Kk1';

// const port = config.port;
// let url = config.url;

// console.log(os.platform());

// if (os.platform() === 'darwin') {
//   url = 'http://localhost';
// }

beforeEach(() => {
  clearV1();
});

describe ('HTTP tests for message/send', () => {

  // If messageSendV1 is successful
  describe('Testing successful messageSendV1', () => {
    test('Test valid sending of message', () => {
      // Create a token from authRegisterV2
      let res = request(
        'POST',
        SERVER_URL + '/auth/register/v2',
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
        SERVER_URL + '/channels/create/v2',
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
        SERVER_URL + '/message/send/v1',
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
    });

    // Add more success tests later
  });

  // If the channelId does not refer to a valid channel
  describe('Testing invalid channelId', () => {
    test('Test undefined channelId', () => {
      // Create a token from authRegisterV2
      let res = request(
        'POST',
        SERVER_URL + '/auth/register/v2',
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
        SERVER_URL + '/message/send/v1',
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
        SERVER_URL + '/auth/register/v2',
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
        SERVER_URL + '/message/send/v1',
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

    // Add more invalid channelId error cases later
  });

  // If the length of message is less than 1 or over 1000 characters
  describe('Testing invalid message lengths', () => {
    test('Test if length of message is less than 1 character', () => {
      // Create a token from authRegisterV2
      let res = request(
        'POST',
        SERVER_URL + '/auth/register/v2',
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
        SERVER_URL + '/channels/create/v2',
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
        SERVER_URL + '/message/send/v1',
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
        SERVER_URL + '/auth/register/v2',
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
        SERVER_URL + '/channels/create/v2',
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
        SERVER_URL + '/message/send/v1',
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
      SERVER_URL + '/auth/register/v2',
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
      SERVER_URL + '/auth/register/v2',
      {
        json: {
          email: 'user@gmail.com',
          password: 'pw',
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
      SERVER_URL + '/channels/create/v2',
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
    // Create a messageId from messageSendV1
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v1',
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
