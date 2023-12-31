import { channelDetailsV1, channelInviteV1, channelMessagesV1, channelJoinV1, 
  channelDetailsV1forV3, channelJoinV1forV3, channelInviteV1forV3, channelMessagesV1forV3 } from './channel';
import { isTokenValid, tokenToAuthUserId } from './token';

import HTTPError from 'http-errors';

export function channelDetailsV2(token: string, channelId: number) {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null || authUserId === undefined) {
    return { error: 'error' };
  }
  return channelDetailsV1(authUserId, channelId);
}

export function channelDetailsV3(token: string, channelId: number) {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null || authUserId === undefined) {
    throw HTTPError(403, 'Invalid token');
  }
  return channelDetailsV1forV3(authUserId, channelId);
}

export function channelInviteV2(token :string, channelId: number, uId: number) {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null || authUserId === undefined) {
    return { error: 'error' };
  }
  return channelInviteV1(authUserId, channelId, uId);
}

export function channelInviteV3(token :string, channelId: number, uId: number) {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null || authUserId === undefined) {
    throw HTTPError(403, 'Invalid token');
  }
  return channelInviteV1forV3(authUserId, channelId, uId);
}

export function channelJoinV2(token :string, channelId: number) {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null || authUserId === undefined) {
    return { error: 'error' };
  }
  return channelJoinV1(authUserId, channelId);
}

export function channelJoinV3(token :string, channelId: number) {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null || authUserId === undefined) {
    throw HTTPError(403, 'Invalid token');
  }
  return channelJoinV1forV3(authUserId, channelId);
}

export function channelMessagesV2(token: string, channelId: number, start: number) {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null || authUserId === undefined) {
    return { error: 'error' };
  }
  return channelMessagesV1(authUserId, channelId, start);
}

export function channelMessagesV3(token: string, channelId: number, start: number) {
  const authUserId = tokenToAuthUserId(token, isTokenValid(token));
  if (authUserId === null || authUserId === undefined) {
    throw HTTPError(403, 'Invalid token');
  }
  return channelMessagesV1forV3(authUserId, channelId, start);
}
