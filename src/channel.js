import { getData } from './dataStore.js'

const error = { error: 'error' };

function channelJoinV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

function channelInviteV1(authUserId, channelId, uId) {
    return 'authUserId' + 'channelId' + 'uId';
}

function channelDetailsV1(authUserId, channelId) {

    const data = getData();
    
    if ((data.channels).includes(channelId) === false) {
        return error;
    }
      
    if ((data.users[authUserId].channels).includes(channelId) === true) {
        
        let status = data.channels[channelId].isPublic;
        let owner = data.channels[channelId].ownerMembers;
        let all = data.channels[channelId].allMembers;
           
        return { 
            name: name,
            isPublic: isPublic,
            ownerMembers: owner,
            allMembers: all,
        };
    }
  
    return error;
}

function channelMessagesV1(authUserId, channelId, start) {
    return 'authUserId' + 'channelId' + 'start';
}


export { channelJoinV1, channelDetailsV1 };
