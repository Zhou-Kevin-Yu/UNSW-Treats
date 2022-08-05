import { userInfo } from "os";
import { getData, setData } from "./dataStore";
import { isTokenValid, tokenToAuthUserId } from "./token";
import config from "./config.json"
import request from 'sync-request';
import os from 'os';
import HTTPError from 'http-errors';

const OK = 200;
const port = config.port;
let url = config.url;
if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

const ownerPermission = 1;
const memberPermission = 2;

export function adminUserRemoveV1(token: string, uId: number) {
    if (!isTokenValid(token)) {
        throw HTTPError(403, 'Invalid token');
    }
    const data = getData();
    let numOwners = 0;
    for (const user of data.users) {
        if (user.permission === ownerPermission) {
            numOwners++;
        }
    }
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (data.users[authUserId].permission != ownerPermission) {
        throw HTTPError(403, 'Authuser is not an owner');
    }
    if (data.users[uId] == null) {
        throw HTTPError(400, 'Invalid uId');
    }
    if (numOwners === 1 && data.users[uId].permission === ownerPermission) {
        throw HTTPError(400, 'Cannot remove only owner');
    }
    for (const channel of data.channels) {
        delete channel.allMembers[uId];
        delete channel.ownerMembers[uId];
    }
    delete data.users[uId];
    for (const channel of data.channels) {
        for (let i = 0; i < channel.messages.length; i++) {
            if (channel.messages[i].uId === uId) {
                channel.messages[i].message = 'Removed user';
            }
        }
    }
    setData(data);
    return {}
}

export function adminChangeUserPermissionV1(token: string, uId: number, permissionId: number) {
    const data = getData();
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    let numOwners = 0;
    for (const user of data.users) {
        if (user.permission === ownerPermission) {
            numOwners++;
        }
    }
    if (authUserId === null) {
        throw HTTPError(403, 'Invalid token');
    }
    if (data.users[authUserId].permission !== ownerPermission) {
        throw HTTPError(403, 'AuthUser does not have owner permissions')
    }
    if (data.users[uId] === null) {
        throw HTTPError(400, 'Invalid userId');
    }
    if (numOwners === 1 && permissionId === memberPermission) {
        throw HTTPError(400, 'Cannot change only owner to member')
    }
    if (permissionId !== ownerPermission && permissionId !== memberPermission) {
        throw HTTPError(400, 'Invalid permissionId')
    }
    if (data.users[uId].permission === permissionId) {
        throw HTTPError(400, 'User permission already set to permissionId')
    }
    data.users[uId].permission = permissionId;
    setData(data);
    return {};
}

export function adminChangeUserPermissionV1ServerSide(token: string, uId: number, permissionId: number) {
    const res = request(
      'POST', `${url}:${port}/admin/userpermission/change/v1`, {
        headers: {
          'token': token,
        },
        json: {
          uId,
          permissionId,
        }
      }
    );
    return res;
  }

  export function adminUserRemoveV1ServerSide(token: string, uId: number) {
    const res = request(
        'DELETE', `${url}:${port}/admin/user/remove/v1`, {
            headers: {
                'token': token,
            },
            json: {
                uId,
            }
        }
    );
    return res;
  }
  