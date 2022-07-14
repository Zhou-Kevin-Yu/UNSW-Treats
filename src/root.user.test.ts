import request from 'sync-request';
import config from './config.json';
import os from 'os';

const OK = 200;
const port = config.port;
let url = config.url;

import { userProfileV2ServerSide, userSetnameV1ServerSide, userSetemailV1ServerSide, userSethandleV1ServerSide } from './wrapped.user';
import { authLoginV2ServerSide, authRegisterV2ServerSide, authLogoutV1ServerSide } from './wrapped.auth';

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

describe('Testing /user/profile/v2', () => {
    test('uId is not valid', () => {
        const token = authRegisterV2ServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt').token;
        const user = userProfileV2ServerSide(token, 1);
        expect(user).toEqual({ error: 'error' });
    });

    test('token is not valid', () => {
        const authed = authRegisterV2ServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt');
        const token = authed.token;
        const uId = authed.authUserId;
        authLogoutV1ServerSide(token);
        const user = userProfileV2ServerSide(token, uId);
        expect(user).toEqual({ error: 'error' });
    });

    test('valid return test', () => {
      const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
      const user = userProfileV2ServerSide(authed.token, authed.authUserId);
      expect(user).toEqual({user: {
        uId: authed.authUserId,
        email: 'gary.sun@student.unsw.edu.au',
        nameFirst: 'Gary',
        nameLast: 'Sun',
        handleStr: 'garysun',
      }});
    });
});

describe('Testing /user/profile/setname/v1', () => {
  test('token is not valid', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    authLogoutV1ServerSide(authed.token);
    const user = userSetnameV1ServerSide(authed.token, "Garyy", "Sunn");
    expect(user).toEqual({ error: 'error' });
  });

  test('nameFirst is invalid', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const user = userSetnameV1ServerSide(authed.token, "", "Sunn");
    expect(user).toEqual({ error: 'error' });
  });

  test('nameLast is invalid', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const user = userSetnameV1ServerSide(authed.token, "Garyy", "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm");
    expect('qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm'.length).toBe(52);
    expect(user).toEqual({ error: 'error' });
  });

  test('valid return test', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    userSetnameV1ServerSide(authed.token, "Garyy", "Sunn");
    const user = userProfileV2ServerSide(authed.token, authed.authUserId);
    expect(user).toEqual({user: {
      uId: authed.authUserId,
      email: 'gary.sun@stundent.unsw.edu.au',
      nameFirst: 'Garyy',
      nameLast: 'Sunn',
      handleStr: 'garysun',
    }});
  });
});

describe('Testing /user/profile/setemail/v1', () => {
  test('token is not valid', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    authLogoutV1ServerSide(authed.token);
    const user = userSetemailV1ServerSide(authed.token, 'garynew.sun@gmaill.com');
    expect(user).toEqual({ error: 'error' });
  });

  test('email is being used by another user', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    authRegisterV2ServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt');
    const user = userSetemailV1ServerSide(authed.token, 'ben.kerno4@gmail.com');
    expect(user).toEqual({ error: 'error' });
  });

  test('email is invalid', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const user = userSetemailV1ServerSide(authed.token, 'gary');
    expect(user).toEqual({ error: 'error' });
  });

  test('valid return test', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    userSetemailV1ServerSide(authed.token, 'gary.sun1@gmail.com');
    const user = userProfileV2ServerSide(authed.token, authed.authUserId);
    expect(user).toEqual({user: {
      uId: authed.authUserId,
      email: 'gary.sun1@gmail.com',
      nameFirst: 'Gary',
      nameLast: 'Sun',
      handleStr: 'garysun',
    }});
  });
});

describe('Testing /user/profile/sethandle/v1', () => {
  test('token is not valid', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    authLogoutV1ServerSide(authed.token);
    const user = userSethandleV1ServerSide(authed.token, 'garysun');
    expect(user).toEqual({ error: 'error' });
  });

  test('handle is too short', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const user = userSethandleV1ServerSide(authed.token, 'ga');
    expect(user).toEqual({ error: 'error' });
  });
  test('handle is too long', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const user = userSethandleV1ServerSide(authed.token, 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm');
    expect(user).toEqual({ error: 'error' });
  });

  test('handle isnt alpha-numeric', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const user = userSethandleV1ServerSide(authed.token, '!@#$%^&*()_+');
    expect(user).toEqual({ error: 'error' });
  });

  test('handle is being used by another user', () => {
    authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    const token = authRegisterV2ServerSide('ben.kerno4@gmail.com', 'dogIsCute', 'benjamined', 'kernohandomeessdfsdfrt').token;
    const user = userSethandleV1ServerSide(token, 'garysun');
    expect(user).toEqual({ error: 'error' });
  });

  test('valid return test', () => {
    const authed = authRegisterV2ServerSide('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
    userSethandleV1ServerSide(authed.token, 'gary');
    const user = userProfileV2ServerSide(authed.token, authed.authUserId);
    expect(user).toEqual({user: {
      uId: authed.authUserId,
      email: 'gary.sun@student.unsw.edu.au',
      nameFirst: 'Gary',
      nameLast: 'Sun',
      handleStr: 'gary',
    }});
  });
});