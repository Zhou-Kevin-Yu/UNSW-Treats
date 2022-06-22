import { getData, setData } from './dataStore'
import { userProfileV1 }    from './users.js'


function channelsCreateV1(authUserId, name, isPublic) {
    if (name.length < 1 || name.length > 20) {
        return { error: 'error' };
    }
    const authUser = userProfileV1(authUserId, authUserId);
    const data = getData();
    const newChannel = {
        channelId:      data.channels.length,
        name:           name,
        isPublic:       isPublic,
        ownerMembers:   [authUser],
        allMembers:     [authUser],
        messages:       []
    };
    data.channels.push(newChannel);
    setData(data);
    return {channelId: newChannel.channelId };
}

//stub for a function 'channelsListallV1' with arguments named 'authUserId'
//returns a string with the name "authUserId"
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

export { channelsCreateV1, channelsListallV1, channelsListV1 };
