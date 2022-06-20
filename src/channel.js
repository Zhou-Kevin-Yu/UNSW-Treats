import { getData } from './dataStore.js'


function channelJoinV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

// 8.4. Documentation contribution

function channelInviteV1(authUserId, channelId, uId) {
    
    let data = getData();
    // If user Id is invalid
    if ((data.users).includes(uId) === false) {
        return { error: 'error' };
    }
    // If channel Id is invalid
    if ((data.channels).includes(channelId) === false) {
        return { error: 'error' };
    }
    // To loop through all the existing channels 
    for (const channel of data.channels) {
        // If the channel Id exists
        if (channelId === channel.channelId) {
            // To loop through all the members in selected channel
            for (const members of channel.allMembers) {
                // If user is already a member of the channel before the invite is sent
                if (uId === members.uId) {
                    return { error: 'error' };
                }
                else if (authUserId === members.uId) {
                    // Add user Id to members array in the channel
                    members.push(uId);
                    return { };
                }
                // If the auth user is not a member of the channel
                else {
                    return { error: 'error' };
                }
            }
        }
    } 

    return { };
}

function channelDetailsV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

// doing this one
function channelMessagesV1(authUserId, channelId, start) {
    return 'authUserId' + 'channelId' + 'start';
}

export { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1};

