import express, { Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { tokenToAuthUserId, isTokenValid } from './token';
import { authLoginV1, wrappedAuthRegister, authLogoutV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListallV1 } from './channels';
import { dmCreateV1, dmListV1, dmRemoveV1, dmDetailsV1, dmLeaveV1, dmMessagesV1 } from './dm';
import { messageSendV1, messageEditV1, messageRemoveV1, messageSendDmV1, messageShareV1,
   messageReactV1, messagePinV1, messageUnreactV1, messageUnpinV1, messageSendlaterV1, messageSendlaterDmV1 } from './message';
import { usersAllV1 } from './users';
import { clearV1 } from './other';
import { channelAddOwnerV1, channelLeaveV1, channelRemoveOwnerV1 } from './channel';
import { channelDetailsV2, channelInviteV2, channelJoinV2, channelMessagesV2 } from './channel_wrap';
import { userProfileV2, userProfileSetnameV1, userProfileSetemailV1, userProfileSethandleV1 } from './user';

// const errorOutput = { error: 'error' };

import { getData, setData } from './dataStore';
import { persistantReadData } from './persistant';
import { isPrivateIdentifier } from 'typescript';
// import createHttpError from 'http-errors';
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

// for checking token validity
// TODO: check for which route calls, rather than if token exists
app.use((req: Request, res: Response, next) => {
  // console.log("request: ", req.url);
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

// All auth requests
app.post('/auth/login/v3', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const returned = authLoginV1(email, password);
  if ('error' in returned) {
    throw HTTPError(400, 'Invalid email or password');
  }
  res.json(authLoginV1(email, password));
});

app.post('/auth/register/v3', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(wrappedAuthRegister(email, password, nameFirst, nameLast));
});

app.post('/auth/logout/v2', (req: Request, res: Response) => {
  // const { token } = req.body;
  const token = req.header('token');
  res.json(authLogoutV1(token));
});

// app.post('/auth/passwordreset/request/v1', (req: Request, res: Response) => {
//   const { email } = req.body;
//   res.json("do something with ${email}");
// });

// app.post('/auth/passwordreset/reset/v1', (req: Request, res: Response) => {
//   const { resetCode, newPassword } = req.body;
//   res.json("do something with ${resetCode} and ${newPassword}");
// });

/// /////////////////////////////////////////////////////////channels functions
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

/// /////////////////////////////////////////////////////////

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

////////////////// All channel requests //////////////////////
// Old message requests - with updated routes
app.post('/channel/addowner/v2', (req: Request, res: Response) => {
  const { channelId, uId } = req.body;
  const token = req.header('token');
  res.json(channelAddOwnerV1(token, channelId, uId));
});

app.get('/channel/details/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const cId = parseInt(req.query.channelId as string);
  res.json(channelDetailsV2(token, cId));
});

app.post('/channel/invite/v3', (req: Request, res: Response) => {
  const { channelId, uId } = req.body;
  const token = req.header('token');
  res.json(channelInviteV2(token, channelId, uId));
});

app.post('/channel/join/v3', (req: Request, res: Response) => {
  const { channelId } = req.body;
  const token = req.header('token');
  res.json(channelJoinV2(token, channelId));
});

app.post('/channel/leave/v2', (req: Request, res: Response) => {
  const { channelId } = req.body;
  const token = req.header('token');
  res.json(channelLeaveV1(token, channelId));
});

app.get('/channel/messages/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  res.json(channelMessagesV2(token, channelId, start));
});

app.post('/channel/removeowner/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  res.json(channelRemoveOwnerV1(token, channelId, uId));
});

// Old message requests
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

////////////////// All message requests //////////////////////
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

// Old message requests - updated routes
app.post('message/send/v2', (req: Request, res: Response) => {
  const { channelId, message } = req.body;
  const token = req.header('token');
  res.json(messageSendV1(token, channelId, message));
});

app.put('/message/edit/v2', (req: Request, res: Response) => {
  const { messageId, message } = req.body;
  const token = req.header('token');
  res.json(messageEditV1(token, messageId, message));
});

app.delete('/message/remove/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const messageId = req.query.messageId as string;
  const newMessageId = parseInt(messageId);
  res.json(messageRemoveV1(token, newMessageId));
});

app.post('/message/senddm/v2', (req: Request, res: Response) => {
  const { dmId, message } = req.body;
  const token = req.header('token');
  res.json(messageSendDmV1(token, dmId, message));
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

////////////////// All users requests //////////////////
app.get('/users/all/v1', (req: Request, res: Response) => {
  const { token } = req.query;
  const tokenParse = token.toString();
  res.json(usersAllV1(tokenParse));
});

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
