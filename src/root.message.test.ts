import request from 'sync-request';
import config from './config.json';
import os from 'os';

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

// HTTP testing for message/send/v1
describe('HTTP tests for message/send', () => {
  // If messageSendV1 is successful
  describe('Testing successful messageSendV1', () => {
    test('Test valid sending of message', () => {
      // Create a token from authRegisterV2
      let res = request(
        'POST',
        `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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

      // Add more invalid channelId error cases later
    });

    // If the length of message is less than 1 or over 1000 characters
    describe('Testing invalid message lengths', () => {
      test('Test if length of message is less than 1 character', () => {
        // Create a token from authRegisterV2
        let res = request(
          'POST',
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
        `${url}:${port}/auth/register/v2`,
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
        `${url}:${port}/auth/register/v2`,
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
      // Create a messageId from messageSendV1
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
        `${url}:${port}/auth/register/v2`,
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

    test('Test valid edit of message in DM', () => {
      // Create a token from authRegisterV2
      const res1 = request(
        'POST',
        `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
    // Add more success tests later
  });

  // If messageEditV1 return an error
  describe('Testing error cases for message/edit', () => {
    // If the length of message is over 1000 characters
    test('Test if length of message is more than 1000 characters', () => {
      // Create a token from authRegisterV2
      const res1 = request(
        'POST',
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
            messageId: messageId - 1000,
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
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
            messageId: messageId + 1000,
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
      const res1 = request(
        'POST',
          `${url}:${port}/auth/register/v2`,
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

      // Create another token from authRegisterV2
      const res2 = request(
        'POST',
          `${url}:${port}/auth/register/v2`,
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

      // The first user creates a channel Id from channelsCreateV2
      // const res5 = request(
      //   'POST',
      //   `${url}:${port}/channels/create/v2`,
      //   {
      //     json: {
      //       token: firstToken,
      //       name: 'ECON1101',
      //       isPublic: true,
      //     }
      //   }
      // );
      // const channel2Obj = JSON.parse(res5.getBody() as string);
      // const secondChannelId = channel2Obj.channelId;
      // The first user joins channel created by second user
      request(
        'POST',
        `${url}:${port}/channels/join/v2`,
        {
          json: {
            token: firstToken,
            channelId: firstChannelId,
          }
        }
      );
      // const channel2Obj = JSON.parse(res5.getBody() as string);
      // const secondChannelId = channel2Obj.channelId;

      // First user tries to edit a valid message but they did not send that message
      const res6 = request(
        'PUT',
        `${url}:${port}/message/edit/v1`,
        {
          json: {
            token: firstToken,
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
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
        `${url}:${port}/auth/register/v2`,
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
      expect(res4.statusCode).toBe(OK);
      // Expect to return empty object
      expect(res4).toStrictEqual({ });
    });

    test('Test valid removal of message in DM', () => {
      // Create a token from authRegisterV2
      const res1 = request(
        'POST',
        `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
      expect(res6.statusCode).toBe(OK);
      // Expect to return empty object
      expect(res6).toStrictEqual({ });
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
          `${url}:${port}/auth/register/v2`,
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
            messageId: messageId - 1000,
          }
        }
      );
      expect(res6.statusCode).toBe(OK);
      // Expect to return error
      expect(res6).toStrictEqual(errorReturn);
    });

    // If messageId does not refer to a valid message within DM
    // That the authorised user has joined
    test('Test if messageId is invalid within DM that the auth user is in', () => {
      // Create a token (first user) from authRegisterV2
      const res1 = request(
        'POST',
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
            messageId: messageId - 1000,
          }
        }
      );
      expect(res6.statusCode).toBe(OK);
      // Expect to return error
      expect(res6).toStrictEqual(errorReturn);
    });

    // If the message in channel was not sent by the authorised user making the request
    test('Test if message in channel was not sent by the authorised user making the request', () => {
      // Create a token from authRegisterV2
      const res1 = request(
        'POST',
          `${url}:${port}/auth/register/v2`,
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

      // Create another token from authRegisterV2
      const res2 = request(
        'POST',
          `${url}:${port}/auth/register/v2`,
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

      // // The first user creates a channel Id from channelsCreateV2 OR SHOULD I DO CHANNEL JOIN
      // const res5 = request(
      //   'POST',
      //   `${url}:${port}/channels/create/v2`,
      //   {
      //     json: {
      //       token: firstToken,
      //       name: 'ECON1101',
      //       isPublic: true,
      //     }
      //   }
      // );
      // const channel2Obj = JSON.parse(res5.getBody() as string);
      // const secondChannelId = channel2Obj.channelId;
      // The first user joins channel created by second user
      request(
        'POST',
        `${url}:${port}/channels/join/v2`,
        {
          json: {
            token: firstToken,
            channelId: firstChannelId,
          }
        }
      );

      // First user did not send message in channel and can't remove it
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
      expect(res6.statusCode).toBe(OK);
      // Expect to return error
      expect(res6).toStrictEqual(errorReturn);
    });

    // If the message in DM was not sent by the authorised user making the request
    test('Test if message in DM was not sent by the authorised user making the request', () => {
      // Create a token (first user) from authRegisterV2
      const res1 = request(
        'POST',
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
      expect(res6.statusCode).toBe(OK);
      // Expect to return error
      expect(res6).toStrictEqual(errorReturn);
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
    test('Test valid sending of message in DM', () => {
      // Create a token (auth user) from authRegisterV2
      const res = request(
        'POST',
        `${url}:${port}/auth/register/v2`,
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
        `${url}:${port}/auth/register/v2`,
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
      // expect(data).toStrictEqual({ messageId: expect.any(Number) });
      // expect(data).toStrictEqual(expect.any(Number));
      expect(data).toStrictEqual(0); // first message should have the messageId : 0;
    });

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
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
          `${url}:${port}/auth/register/v2`,
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
        `${url}:${port}/auth/register/v2`,
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
        `${url}:${port}/auth/register/v2`,
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
        `${url}:${port}/auth/register/v2`,
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
