import { userInfo } from "os";
import { getData } from "./dataStore";
import { isTokenValid, tokenToAuthUserId } from "./token";

const ownerPermission = 1;
const memberPermission = 2;

export function adminUserRemoveV1(token: string, uId: number) {
    const data = getData();
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    let numOwners = 0;
    for (const user of data.users) {
        if (user.permission === ownerPermission) {
            numOwners++;
        }
    }
    if (authUserId === null) {
        return '403 Error';
    }
    if (data.users[authUserId].permission != ownerPermission) {
        return '403 Error';
    }
    if (data.users[uId] == null) {
        return '400 Error';
    }
    if (numOwners === 1 && data.users[uId].permission === ownerPermission) {
        return '400 Error'
    }
    for (const channel of data.channels) {
        channel.allMembers[uId] = undefined;
        channel.ownerMembers[uId] = undefined;
    }
    data.users[uId].nameFirst = 'Removed';
    data.users[uId].nameLast = 'user';
    data.users[uId].email = data.users[uId].email + ' (removed user)'
    data.users[uId].handleStr = data.users[uId].handleStr + ' (removed user)'
    for (const channel of data.channels) {
        for (let i = 0; i < channel.messages.length; i++) {
            if (channel.messages[i].uId === uId) {
                channel.messages[i].message = 'Removed user';
            }
        }
    }
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
        return '403 Error'
    }
    if (data.users[authUserId].permission !== ownerPermission) {
        return '403 Error';
    }
    if (data.users[uId] === null) {
        return '400 Error';
    }
    if (numOwners === 1 && permissionId === memberPermission) {
        return '400 Error';
    }
    if (permissionId !== ownerPermission && permissionId !== memberPermission) {
        return '400 Error';
    }
    if (data.users[uId].permission === permissionId) {
        return '400 Error';
    }
    data.users[uId].permission = permissionId
    return {};
}