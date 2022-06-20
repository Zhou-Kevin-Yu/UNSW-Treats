import { getData } from './dataStore.js'

function channelsCreateV1(authUserId, name, isPublic) {
    return 'authUserId' + 'name' + 'isPublic';
}

//stub for a function 'channelsListallV1' with arguments named 'authUserId'
//returns a string with the name "authUserId"
function channelsListallV1(authUserId) {
    return 'authUserId';
}

// Stub for a function 'channelsListV1' with arugment named 'authUserId'
// returns a string with the name 'authUserId'
function channelsListV1(authUserId) {
    const data = getData();
    const channelArr = [];
    for (const channel of data.channels) {
        for (const members of channel.allMembers) {
            if (authUserId === members.uId) {
                channelArr.push(channel);
            }
        }
    }
    return { channels: channelArr };
}

export { channelsCreateV1, channelsListV1 };