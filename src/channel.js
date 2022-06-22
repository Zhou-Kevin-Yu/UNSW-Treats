import { getData, setData } from './dataStore.js'

const error = { error: 'error' };

function channelJoinV1(authUserId, channelId) {

    const data = getData();   
    let exists = 0;
    
    //if channelId is invalid
    for (const channel of data.channels) {       
        if (channel.channelId === channelId) {
            exists = 1;
        } 
    }
    if (exists === 0) return error;
    exists = 0;
    
    //check if user is not already a member
    for (const member of data.channels[channelId].allMembers) {
       if (authUserId === member.uId) return error;      
    }
    
    //if channel is private and user is not a member
    //Assumes that if user is owner, it is also a member
    if (data.channels[channelId].isPublic === false ) {   
        for (const member of data.channels[channelId].allMembers) {
            if (authUserId === member.uId) {
                exists = 1;
            }
        }       
        if (exists === 0) return error;
    }

    data.channels[channelId].allMembers.push(data.users[authUserId]);
    setData();
    return {};
}

function channelInviteV1(authUserId, channelId, uId) {
    return 'authUserId' + 'channelId' + 'uId';
}

function channelDetailsV1(authUserId, channelId) {

    const data = getData();
    let exists = 0;
    
    //if channelId is invalid
    for (const channel of data.channels) {       
        if (channel.channelId === channelId) {
            exists = 1;
        } 
    }
            
    if (exists === 0) return error;
    
    for (const member of data.channels[channelId].allMembers) {
       if (authUserId === member.uId) {
            return { 
                name:           data.channels[channelId].name,
                isPublic:       data.channels[channelId].isPublic,
                ownerMembers:   data.channels[channelId].ownerMembers,
                allMembers:     data.channels[channelId].allMembers,
            };
       }
    }

    return error;
}

function channelMessagesV1(authUserId, channelId, start) {
    return 'authUserId' + 'channelId' + 'start';
}
export { channelJoinV1, channelDetailsV1, channelMessagesV1, channelInviteV1};

