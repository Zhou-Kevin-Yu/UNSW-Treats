import { getData, setData } from './dataStore.js'


function channelJoinV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

/**
 * Invites a user with ID uId to join a channel with ID channelId
 * and they immediately join
 * 
 * @param {number} authUserId - authorised user that is a part of the selected channel and making the invite request
 * @param {number} channelId - id for the selected channel
 * @param {number} uId  - user to be invited
 * @returns {object} {} - empty object
 * @returns {object} {error: 'error'} - return error if channelId is invalid, uId is invalid, 
 * uId refers to a user who is already a member of the channel, or channelId is valid and the authorised user is not a member of the channel
 */ 

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

    // Declare as empty strings
    let nameFirstCopy = '';
    let nameLastCopy = '';
    let emailCopy = '';
    let handlestrCopy = '';

    for (let user of data.users) {
        // If the user Id exists
        if (uId === user.uId) {
            exist_user = 1;
            nameFirstCopy = user.nameFirst;
            nameLastCopy = user.nameLast;
            emailCopy = user.email;
            handlestrCopy = user.handlestr;
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
                    
                    // Push object user into allMembers array
                    channel.allMembers.push({
                        uId: uId, 
                        nameFirst: nameFirstCopy, 
                        nameLast: nameLastCopy,
                        email:  emailCopy,
                        handlestr: handlestrCopy,
                    });
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


