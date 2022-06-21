import { getData, setData } from './dataStore.js'


function channelJoinV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

// NEED DOCUMENTATION

function channelInviteV1(authUserId, channelId, uId) {
    
    let data = getData();
    let exist_channel = 0;
    let exist_user = 0;
    // To loop through all the existing channels 
    for (let channel of data.channels) {
        // If the channel Id exists
        if (channelId === channel.channelId) {
            // To loop through all the members in selected channel
            for (let member of channel.allMembers) {
                // If user is already a member of the channel before the invite is sent
                if (uId === member.uId) {
                    return { error: 'error' };
                }
            }
        }
    } 

    for (let user of data.users) {
        // If the user Id exists
        if (uId === user.uId) {
            exist_user = 1;
        }
    }
    
    // If the user Id does not exist or is invalid
    if (exist_user === 0) {
        return { error: 'error' };
    }

    // To loop through all the existing channels 
    for (let channel of data.channels) {
        // If the channel Id exists
        if (channelId === channel.channelId) {
            exist_channel = 1;
            // To loop through all the members in selected channel
            for (let member of channel.allMembers) {
                // If the auth user is a member
                if (authUserId === member.uId) {
                    // Add user Id to members array in the channel
                    channel.allMembers.push(uId);
                    setData(data);
                    return { };
                }
            }
            // If the auth user is not a member of the channel
            return { error: 'error' };
        }
    } 
    
    // If the channel Id does not exist or is invalid
    if (exist_channel === 0) {
        return { error: 'error' };
    }
}

function channelDetailsV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

// doing this one
function channelMessagesV1(authUserId, channelId, start) {
    return 'authUserId' + 'channelId' + 'start';
}

export { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1};


