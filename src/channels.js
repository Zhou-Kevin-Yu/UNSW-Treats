import { getData, setData } from './dataStore'
import { userProfileV1 }    from './users.js'


function channelsCreateV1(authUserId, name, isPublic) {
    //Checking for a valid channel name
    if (name.length < 1 || name.length > 20) {
        return { error: 'error' };
    }
    //Storing user object
    const authUser = userProfileV1(authUserId, authUserId);
    const data = getData();
    //Creating channel
    const newChannel = {
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
    return {channelId: newChannel.channelId };
}

function channelsListallV1(authUserId) {
    let data = getData();
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

// Stub for a function 'channelsListV1' with arugment named 'authUserId'
// returns a string with the name 'authUserId'
function channelsListV1(authUserId) {
    const data = getData();
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

export { channelsCreateV1, channelsListV1, channelsListallV1 };
