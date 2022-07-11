import { getData, setData }     from './dataStore'
import { User, userProfileV1 }  from './users'
import { Message }              from './channel'


/**Creates a new channel with the given name that is either a public or private channel. 
*The user who created it automatically joins the channel.
*@param {number} authUserId - ID of the user creating the channel
*@param {string} name - name of the channel
*@param {bool} isPublic - whether the channel is/isn't Public -  true for public
*@return {object}An object containing the Id of the created channel and the key 'channelId'
**/

export interface Channel {
    channelId:      number,
    name:           string,
    isPublic:       boolean,
    ownerMembers:   User[],
    allMembers:     User[],
    messages:       Message[]
}

function channelsCreateV1(authUserId: number, name: string, isPublic: boolean) {
    //Checking for a valid channel name
    if (name.length < 1 || name.length > 20) {
        // return { error: 'error' };
        throw new Error('name is not valid');
    }
    //checking for valid authUserId
    const data = getData();
    if (!(authUserId in data.users)) {
        // return { error: 'error' };
        throw new Error('authUserId not in data.users');
    }
    // //Storing user object
    const authUserr = userProfileV1(authUserId, authUserId).user;
    // if (authUserr === { error: 'error' } ) { 
    //     // return { error: 'error' }
    //     throw new Error('authUserr not in data.users');
    // };
    const authUser = authUserr;

    const newChannel: Channel = {
        /*ChannelIds are incremented starting from 0, therefore the channelId
        will be set to the length of the array of channels*/
        channelId:      data.channels.length,
        name:           name,
        isPublic:       isPublic,
        ownerMembers:   [authUser],
        allMembers:     [authUser],
        messages:       []
    };
    //Add new channel to dataStore
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
function channelsListallV1(authUserId: number) {
    let data = getData();
    if (!(authUserId in data.users)) {
        // return { error: 'error' };
        throw new Error('authUserId not in data.users');
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
function channelsListV1(authUserId: number) {
    const data = getData();
    if (!(authUserId in data.users)) {
        // return { error: 'error' };
        throw new Error('authUserId not in data.users');
    }
    const channelArr = [];
    for (const channel of data.channels) {
        for (const members of channel.allMembers) {
            if (authUserId === members.uId) {
                const channelObject = {
                    channelId:  channel.channelId,
                    name:       channel.name
                }
                channelArr.push(channelObject);
            }
        }
    }
    return { channels: channelArr };
}

export { channelsCreateV1, channelsListallV1, channelsListV1 };
