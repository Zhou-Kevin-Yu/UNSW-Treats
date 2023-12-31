import express, { Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { tokenToAuthUserId, isTokenValid } from './token';
import { authLoginV1, wrappedAuthRegister, authLogoutV1, authPasswordResetRequestV1, authPasswordResetResetV1, generateResetCode } from './auth';
import { channelsCreateV1, channelsListV1, channelsListallV1, 
  channelsCreateV3, channelsListV3, channelsListallV3 } from './channels';
import { dmCreateV1, dmListV1, dmRemoveV1, dmDetailsV1, dmLeaveV1, dmMessagesV1, 
dmCreateV3, dmListV3, dmRemoveV3, dmDetailsV3, dmLeaveV3, dmMessagesV3 } from './dm';
import { messageSendV1, messageSendV2, messageEditV3, messageSendDmV3, messageRemoveV3, messageEditV1, messageRemoveV1, messageSendDmV1, messageShareV1,

   messageReactV1, messagePinV1, messageUnreactV1, messageUnpinV1, messageSendlaterV1, messageSendlaterDmV1 } from './message';

import {  userProfileUploadPhotoV1, userStatsV1, userProfileSetnameV3, userProfileSetemailV3, userProfileSethandleV3 } from './user';

import { usersAllV1, usersAllV3, usersStatsV1 } from './users';
import { clearV1 } from './other';
import { channelAddOwnerV1, channelLeaveV1, channelRemoveOwnerV1,
  channelLeaveV3, channelAddOwnerV3, channelRemoveOwnerV3 } from './channel';
import { channelDetailsV2, channelInviteV2, channelJoinV2, channelMessagesV2,
  channelDetailsV3, channelJoinV3, channelInviteV3, channelMessagesV3 } from './channel_wrap';
import { userProfileV2, userProfileSetnameV1, userProfileSetemailV1, userProfileSethandleV1, userProfileV3 } from './user';


import { standupStartV1, standupActiveV1, standupSendV1 } from './standup';

import { searchV1 } from './search';
import { adminUserPermissionChangeV1 } from './admin';

import { getData, setData } from './dataStore';
import { persistantReadData } from './persistant';
import { isPrivateIdentifier } from 'typescript';
import HTTPError from 'http-errors';

// Set up web app, use JSON
const app = express();
app.use(express.json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req, res, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// for logging errors
app.use(morgan('dev'));
app.use('/photos', express.static('photos'));

// for checking token validity
// TODO: check for which route calls, rather than if token exists
app.use((req: Request, res: Response, next) => {
  const fullToken = req.header('token');
  if (fullToken !== undefined && fullToken !== null) {
    if (!isTokenValid(fullToken)) {
      throw HTTPError(403, "Access Denied: Token is invalid");
    } else if (tokenToAuthUserId(fullToken, true) === null || 
              tokenToAuthUserId(fullToken, true) === undefined) {
      throw HTTPError(403, "Access Denied: Token is invalid");
    }
  }
  next();
});

/////// admin routes ////////
app.post('/admin/userpermission/change/v1', (req: Request, res: Response) => {
  const { uId, permissionId } = req.body;
  const token = req.header('token');
  res.json(adminUserPermissionChangeV1(token, uId, permissionId));
});

// All search requests
app.get('/search/v1', (req: Request, res: Response, next) => {
  const token = req.header('token');
  const query = req.query.queryStr as string;
  res.json(searchV1(token, query));
});

// All auth requests - ALL V3 COMPLIANT
app.post('/auth/login/v3', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const returned = authLoginV1(email, password);
  if ('error' in returned) {
    throw HTTPError(400, 'Invalid email or password');
  }
  res.json(returned);
});

app.post('/auth/register/v3', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(wrappedAuthRegister(email, password, nameFirst, nameLast));
});

app.post('/auth/logout/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(authLogoutV1(token));
});

app.post('/auth/passwordreset/request/v1', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json(authPasswordResetRequestV1(email));
});

app.post('/auth/passwordreset/reset/v1', (req: Request, res: Response) => {
  const { resetCode, newPassword } = req.body;
  res.json(authPasswordResetResetV1(resetCode, newPassword));
});

// channels functions - OLD Channels
app.post('/channels/create/v2', (req: Request, res: Response) => {
  const { token, name, isPublic } = req.body;
  if (!isTokenValid(token)) {
    res.json({ error: 'error' });
  } else {
    const authId = tokenToAuthUserId(token, true);
    res.json(channelsCreateV1(authId, name, isPublic));
  }
});

app.get('/channels/list/v2', (req: Request, res: Response) => {
  const { token } = req.query;
  const tokenParse = token.toString();
  if (!isTokenValid(tokenParse)) {
    res.json({ error: 'error' });
  } else {
    const authId = tokenToAuthUserId(tokenParse, true);
    res.json(channelsListV1(authId));
  }
});

app.get('/channels/listall/v2', (req: Request, res: Response) => {
  const { token } = req.query;
  const tokenParse = token.toString();
  if (!isTokenValid(tokenParse)) {
    res.json({ error: 'error' });
  } else {
    const authId = tokenToAuthUserId(tokenParse, true);
    res.json(channelsListallV1(authId));
  }
});

// Channels requests - ALL V3 COMPLIANT
app.post('/channels/create/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Access Denied: Token is invalid');
  }
  const { name, isPublic } = req.body;
  const authId = tokenToAuthUserId(token, true);
  res.json(channelsCreateV3(authId, name, isPublic));
});

app.get('/channels/list/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Access Denied: Token is invalid');
  } else {
    const authId = tokenToAuthUserId(token, true);
    res.json(channelsListV3(authId));
  }
});

app.get('/channels/listall/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  if (!isTokenValid(token)) {
    throw HTTPError(403, 'Access Denied: Token is invalid');
  } else {
    const authId = tokenToAuthUserId(token, true);
    res.json(channelsListallV3(authId));
  }
});

// Clear Route
app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
});

// All user routes
app.get('/user/profile/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const u = req.query.uId as string;
  const uId = parseInt(u);
  res.json(userProfileV2(token, uId));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response) => {
  const { token, nameFirst, nameLast } = req.body;
  res.json(userProfileSetnameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v1', (req: Request, res: Response) => {
  const { token, email } = req.body;
  res.json(userProfileSetemailV1(token, email));
});

app.put('/user/profile/sethandle/v1', (req: Request, res: Response) => {
  const { token, handleStr } = req.body;
  res.json(userProfileSethandleV1(token, handleStr));
});

////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/user/profile/uploadphoto/v1', (req: Request, res: Response) => {
  const { imgUrl, xStart, xEnd, yStart, yEnd } = req.body;
  const token = req.header('token');
  res.json(userProfileUploadPhotoV1(token, imgUrl, xStart, xEnd, yStart, yEnd));
});

app.get('/user/stats/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(userStatsV1(token));
});

app.get('/users/stats/v1', (req: Request, res: Response) => {
  res.json(usersStatsV1());
});
////////////////////////////////////////////////////////////////////////////////////////////////


// All user requests - ALL V3 COMPLIANT
app.get('/user/profile/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const u = req.query.uId as string;
  const uId = parseInt(u);
  res.json(userProfileV3(token, uId));
});

app.put('/user/profile/setname/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { nameFirst, nameLast } = req.body;
  res.json(userProfileSetnameV3(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { email } = req.body;
  res.json(userProfileSetemailV3(token, email));
});

app.put('/user/profile/sethandle/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { handleStr } = req.body;
  res.json(userProfileSethandleV3(token, handleStr));
});

// All dm requests
app.post('/dm/create/v1', (req: Request, res: Response) => {
  const { token, uIds } = req.body;
  res.json(dmCreateV1(token, uIds));
});

app.get('/dm/list/v1', (req: Request, res: Response) => {
  const { token } = req.query;
  const tokenParse = token.toString();
  res.json(dmListV1(tokenParse));
});

app.delete('/dm/remove/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  const newDmId = parseInt(dmId);
  // const { token, dmId } = req.query;
  res.json(dmRemoveV1(token, newDmId));
});

app.get('/dm/details/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  const newDmId = parseInt(dmId);
  res.json(dmDetailsV1(token, newDmId));
});

app.post('/dm/leave/v1', (req: Request, res: Response) => {
  const { token, dmId } = req.body;
  res.json(dmLeaveV1(token, dmId));
});

app.get('/dm/messages/v1', (req: Request, res: Response) => {
  // const { token, dmId, start } = req.query;
  const token = req.query.token as string
  const dmId = parseInt(req.query.dmId as string)
  const start = parseInt(req.query.start as string)
  res.json(dmMessagesV1(token, dmId, start));
});
// TODO add dm/messages/v1

// DM requests - ALL V3 COMPLIANT
app.post('/dm/create/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { uIds } = req.body;
  res.json(dmCreateV3(token, uIds));
});

app.get('/dm/list/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(dmListV3(token));
});

app.delete('/dm/remove/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const dmId = req.query.dmId as string;
  const newDmId = parseInt(dmId);
  res.json(dmRemoveV3(token, newDmId));
});

app.get('/dm/details/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const dmId = req.query.dmId as string;
  const newDmId = parseInt(dmId);
  res.json(dmDetailsV3(token, newDmId));
});

app.post('/dm/leave/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { dmId } = req.body;
  res.json(dmLeaveV3(token, dmId));
});

app.get('/dm/messages/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string)
  const start = parseInt(req.query.start as string)
  res.json(dmMessagesV3(token, dmId, start));
});


// All channel requests - ALL V3 COMPLIANT NOT YET
app.get('/channel/details/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const cId = parseInt(req.query.channelId as string);
  res.json(channelDetailsV3(token, cId));
});

app.post('/channel/join/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId } = req.body;
  res.json(channelJoinV3(token, channelId));
});

app.post('/channel/invite/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  res.json(channelInviteV3(token, channelId, uId));
});

app.get('/channel/messages/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  res.json(channelMessagesV3(token, channelId, start));
});

app.post('/channel/leave/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId } = req.body;
  res.json(channelLeaveV3(token, channelId));
});

app.post('/channel/addowner/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  res.json(channelAddOwnerV3(token, channelId, uId));
});

app.post('/channel/removeowner/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  res.json(channelRemoveOwnerV3(token, channelId, uId));
});

// Old channel requests
app.post('/channel/addowner/v1', (req: Request, res: Response) => {
  const { token, channelId, uId } = req.body;
  res.json(channelAddOwnerV1(token, channelId, uId));
});

app.get('/channel/details/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const cId = parseInt(req.query.channelId as string);
  res.json(channelDetailsV2(token, cId));
});

app.post('/channel/invite/v2', (req: Request, res: Response) => {
  const { token, channelId, uId } = req.body;
  res.json(channelInviteV2(token, channelId, uId));
});

app.post('/channel/join/v2', (req: Request, res: Response) => {
  const { token, channelId } = req.body;
  res.json(channelJoinV2(token, channelId));
});

app.post('/channel/leave/v1', (req: Request, res: Response) => {
  const { token, channelId } = req.body;
  res.json(channelLeaveV1(token, channelId));
});

app.get('/channel/messages/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  res.json(channelMessagesV2(token, channelId, start));
});

app.post('/channel/removeowner/v1', (req: Request, res: Response) => {
  const { token, channelId, uId } = req.body;
  res.json(channelRemoveOwnerV1(token, channelId, uId));
});

// All message requests
// New message requests
app.post('/message/share/v1', (req: Request, res: Response) => {
  const { ogMessageId, message, channelId, dmId } = req.body;
  const token = req.header('token');
  res.json(messageShareV1(token, ogMessageId, message, channelId, dmId));
});

app.post('/message/react/v1', (req: Request, res: Response) => {
  const { messageId, reactId } = req.body;
  const token = req.header('token');
  res.json(messageReactV1(token, messageId, reactId));
});

app.post('/message/unreact/v1', (req: Request, res: Response) => {
  const { messageId, reactId } = req.body;
  const token = req.header('token');
  res.json(messageUnreactV1(token, messageId, reactId));
});

app.post('/message/pin/v1', (req: Request, res: Response) => {
  const { messageId } = req.body;
  const token = req.header('token');
  res.json(messagePinV1(token, messageId));
});

app.post('/message/unpin/v1', (req: Request, res: Response) => {
  const { messageId } = req.body;
  const token = req.header('token');
  res.json(messageUnpinV1(token, messageId));
});

app.post('/message/sendlater/v1', (req: Request, res: Response) => {
  const { channelId, message, timeSent } = req.body;
  const token = req.header('token');
  res.json(messageSendlaterV1(token, channelId, message, timeSent));
});

app.post('/message/sendlaterdm/v1', (req: Request, res: Response) => {
  const { dmId, message, timeSent } = req.body;
  const token = req.header('token');
  res.json(messageSendlaterDmV1(token, dmId, message, timeSent));
});

// Old message requests - V3 compatible
app.post('/message/send/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, message } = req.body;
  res.json(messageSendV2(token, channelId, message));
});

app.put('/message/edit/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { messageId, message } = req.body;
  res.json(messageEditV3(token, messageId, message));
});

app.delete('/message/remove/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const messageId = req.query.messageId as string;
  const newMessageId = parseInt(messageId);
  res.json(messageRemoveV3(token, newMessageId));
});

app.post('/message/senddm/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { dmId, message } = req.body;
  res.json(messageSendDmV3(token, dmId, message));
});

// Old message requests
app.post('/message/send/v1', (req: Request, res: Response) => {
  const { token, channelId, message } = req.body;
  res.json(messageSendV1(token, channelId, message));
});

app.put('/message/edit/v1', (req: Request, res: Response) => {
  const { token, messageId, message } = req.body;
  res.json(messageEditV1(token, messageId, message));
});

app.delete('/message/remove/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const messageId = req.query.messageId as string;
  const newMessageId = parseInt(messageId);
  res.json(messageRemoveV1(token, newMessageId));
});

app.post('/message/senddm/v1', (req: Request, res: Response) => {
  const { token, dmId, message } = req.body;
  res.json(messageSendDmV1(token, dmId, message));
});

// Users Requests
app.get('/users/all/v1', (req: Request, res: Response) => {
  const { token } = req.query;
  const tokenParse = token.toString();
  res.json(usersAllV1(tokenParse));
});

// Users Requests - V3 READY
app.get('/users/all/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(usersAllV3(token));
});

// Standup routes 
app.post('/standup/start/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, length } = req.body;
  res.json(standupStartV1(token, channelId, length));
});

app.get('/standup/active/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  res.json(standupActiveV1(token, channelId));
});

app.post('/standup/send/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, message } = req.body;
  res.json(standupSendV1(token, channelId, message));
});

/// All routes for testing purposes
app.post('/test/genToken', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json(generateResetCode(email));
})

// get Data before spinning up server
const readData = persistantReadData();
let data = getData();
data = Object.assign(data, readData);
setData(data);

// handles errors nicely
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
