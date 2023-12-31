import { getData, setData } from './dataStore';
import { userProfileV1 } from './user';
import { ChannelsCreateV1, ChannelsListAllV1, ChannelsListV1 } from './dataStore';
import { MessagesObj } from './dataStore';

import HTTPError from 'http-errors';


/** Creates a new channel with the given name that is either a public or private channel.
*The user who created it automatically joins the channel.
*@param {number} authUserId - ID of the user creating the channel
*@param {string} name - name of the channel
*@param {bool} isPublic - whether the channel is/isn't Public -  true for public
*@return {object}An object containing the Id of the created channel and the key 'channelId'
**/
function channelsCreateV1(authUserId: number, name: string, isPublic: boolean): ChannelsCreateV1 {
  // Checking for a valid channel name
  if (name.length < 1 || name.length > 20) {
    return { error: 'error' };
  }
  // Storing user object
  const authUser = userProfileV1(authUserId, authUserId).user;
  const data = getData();

  // Checking for valid authUserId
  if (!(authUserId in data.users)) {
    return { error: 'error' };
  }
  const msgArray: MessagesObj[] = [];
  const newChannel = {
    /* ChannelIds are incremented starting from 0, therefore the channelId
        will be set to the length of the array of channels */
    channelId: data.channels.length,
    name: name,
    isPublic: isPublic,
    ownerMembers: [authUser],
    allMembers: [authUser],
    messages: msgArray,
  };
    // Add new channel to dataStore
  data.channels.push(newChannel);
  setData(data);
  return { channelId: newChannel.channelId };
}

/**
 * given a valid authUserId, provides an array of all channels, including
 * private channels, (and their associated details).
 *
 * @param {number} authUserId - email address to be validated using validator
 * @return {authUserId: number} - object with key authUserId.
 * @return {channels:
 *              Array <{
 *                  channelId: number,
 *                  name: string,
 *              }>
 * }
 * Returns an object with key 'channels' associated with an array of objects,
 * where each objects contains types { channelId, name }.
 *
 */
function channelsListallV1(authUserId: number): ChannelsListAllV1 {
  const data = getData();
  if (!(authUserId in data.users)) {
    return { error: 'error' };
  }
  const channels = [];
  for (const channel of data.channels) {
    const channelNew = {
      channelId: channel.channelId,
      name: channel.name,
    };
    channels.push(channelNew);
  }
  return { channels: channels };
}

function channelsListallV3(authUserId: number): ChannelsListAllV1 {
  const data = getData();
  if (!(authUserId in data.users)) {
    throw HTTPError(403, "Access Denied: AuthUser is invalid");  
  }
  const channels = [];
  for (const channel of data.channels) {
    const channelNew = {
      channelId: channel.channelId,
      name: channel.name,
    };
    channels.push(channelNew);
  }
  return { channels: channels };
}

/**
 * Provide an array of all channels (and their associated details) that the authorised user is part of.
 *
 * @param {number} authUserId userId of user calling the function
 * @return {object} Object containing array of channels authUser is in, with key 'channels:'
 *
*/
function channelsListV1(authUserId: number): ChannelsListV1 {
  const data = getData();
  if (!(authUserId in data.users)) {
    return { error: 'error' };
  }
  const channelArr = [];
  for (const channel of data.channels) {
    for (const members of channel.allMembers) {
      if (authUserId === members.uId) {
        const channelObject = {
          channelId: channel.channelId,
          name: channel.name
        };
        channelArr.push(channelObject);
      }
    }
  }
  return { channels: channelArr };
}

function channelsListV3(authUserId: number): ChannelsListV1 {
  const data = getData();
  if (!(authUserId in data.users)) {
    throw HTTPError(403, "Access Denied: AuthUser is invalid");
  }
  const channelArr = [];
  for (const channel of data.channels) {
    for (const members of channel.allMembers) {
      if (authUserId === members.uId) {
        const channelObject = {
          channelId: channel.channelId,
          name: channel.name
        };
        channelArr.push(channelObject);
      }
    }
  }
  return { channels: channelArr };
}

function channelsCreateV3(authUserId: number, name: string, isPublic: boolean): ChannelsCreateV1 {
  // Checking for a valid channel name
  if (name.length < 1 || name.length > 20) {
    throw HTTPError(400, 'Invalid channel name');
  }
  // Storing user object
  const authUser = userProfileV1(authUserId, authUserId).user;
  const data = getData();

  // Checking for valid authUserId
  if (!(authUserId in data.users)) {
    throw HTTPError(403, "Access Denied: Token is invalid");
  }
  const msgArray: MessagesObj[] = [];
  const newChannel = {
    /* ChannelIds are incremented starting from 0, therefore the channelId
        will be set to the length of the array of channels */
    channelId: data.channels.length,
    name: name,
    isPublic: isPublic,
    ownerMembers: [authUser],
    allMembers: [authUser],
    messages: msgArray,
  };
    // Add new channel to dataStore
  data.channels.push(newChannel);
  setData(data);
  return { channelId: newChannel.channelId };
}

export { channelsCreateV1, channelsListallV1, channelsListV1, channelsCreateV3, channelsListV3, channelsListallV3 };
