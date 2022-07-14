import express, { Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

import { authLoginV1, authRegisterV1, authLogoutV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListallV1 } from './channels';
import { dmCreateV1, dmListV1, dmRemoveV1, dmDetailsV1, dmLeaveV1 } from './dm';
import { clearV1 } from './other';

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

// All auth requests
app.post('/auth/login/v2', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(authLoginV1(email, password));
});

app.post('/auth/register/v2', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV1(email, password, nameFirst, nameLast));
});

app.post('/auth/logout/v1', (req: Request, res: Response) => {
  const { token } = req.body;
  res.json(authLogoutV1(token));
});

////////////////////////////////////////////////////////////channels functions
app.post('/channels/create/v2', (req: Request, res: Response) => {

  const { token, name, isPublic } = req.body;
  if(!isTokenValid(token)) return errorOutput;
  const authId = tokenToAuthUserId(token).authUserId;
  res.json(channelsCreateV1(authId, name, isPublic));
});

app.get('/channels/list/V2', (req, res) => {

  const token = req.query;
  if(!isTokenValid(token)) return errorOutput;
  const authId = tokenToAuthUserId(token).authUserId;
  res.json(channelsListV1(authId));
});

app.get('/channels/listall/V2', (req, res) => {

  const token = req.query;
  if(!isTokenValid(token)) return errorOutput;
  const authId = tokenToAuthUserId(token).authUserId;
  res.json(channelsListallV1(authId));
});

////////////////////////////////////////////////////////////

app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
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
  console.log('=======', token, dmId);
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
// TODO add dm/messages/v1

// start server
app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

