import { getData, setData } from './dataStore'


function channelsCreateV1(authUserId, name, isPublic) {
    if (name.length < 1 || name.length > 20) {
        return { error: 'error' };
    }
    const data = getData();
    const newChannel = {
        channelId:      data.channels.length,    
        name:           name,
        isPublic:       isPublic,
        ownerMembers:   [authUserId],          
        allMembers:     [authUserId],
        messages:       []
    };
    
    data.channels.push(newChannel);
    setData(data);
    return {channelId: newChannel.channelId };
}

//stub for a function 'channelsListallV1' with arguments named 'authUserId'
//returns a string with the name "authUserId"
function channelsListallV1(authUserId) {
    return 'authUserId';
}

// Stub for a function 'channelsListV1' with arugment named 'authUserId'
// returns a string with the name 'authUserId'
function channelsListV1(authUserId) {
    return 'authUserId';
}

export { channelsCreateV1, channelsListV1 };
