import { getData } from './dataStore';


function channelsCreateV1(authUserId, name, isPublic) {
    return 'authUserId' + 'name' + 'isPublic';
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
    return 'authUserId';
}

export { channelsCreateV1, channelsListallV1, channelsListV1 };