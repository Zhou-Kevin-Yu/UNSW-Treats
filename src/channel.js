import { getData } from './dataStore.js'

function channelJoinV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

function channelInviteV1(authUserId, channelId, uId) {
    return 'authUserId' + 'channelId' + 'uId';
}

function channelDetailsV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

/**
 * Return up to 50 messages between index "start" and "start + 50"
 * in a selected channel
 * 
 * @param {number} authUserId - authorised user that is a part of the selected channel
 * @param {number} channelId - id for the selected channel
 * @param {number} start  - index of where to start returing messages
 * @returns {array of objects} messages - array of objects, where each object contains types { messageId, uId, message, timeSent }
 * @returns {number} start 
 * @returns {number} end - equal to the value of "start + 50" or "-1" if no more messages to load
 */ 

function channelMessagesV1(authUserId, channelId, start) {
    
    let data = getData();
    let exist_channel = 0;
    let exist_auth = 0;
    let endCopy = start + 50;
    let msgArray = [];

    // To loop through all the existing channels 
    for (let channel of data.channels) {
        // If the channel Id exists
        if (channelId === channel.channelId) {
            exist_channel = 1;
            
            // To loop through all the members in selected channel
            for (let member of channel.allMembers) {
                // If the auth user is a member
                if (authUserId === member.uId) {
                    exist_auth = 1;
                    
                    // Push messages into msgArray
                    msgArray = channel.messages.slice(start, endCopy);

                    // If function returns the last message in the channel
                    // The last message in channel messages got pushed into the last element of msgArray
                    if (channel.messages[endCopy - 1] === msgArray[msgArray.length - 1]) {
                        endCopy = -1;
                    }

                    // If function returns less than 50 messages
                    // Meaning that there are no more messages to return
                    if (msgArray.length < 50) {
                        endCopy = -1;
                    }
                }
            }
            // If there were no existing messages for the selected channel
            if (channel.messages.length === 0) {
                endCopy = -1;
                msgArray = [];
                break;
            }
        }
    } 

    // If the start value is greater than the total number of messages
    if (start > msgArray.length) {
        return { error: 'error' };
    }
    
    // If the channel Id does not exist or is invalid
    if (exist_channel === 0) {
        return { error: 'error' };
    }

    // If the auth user is not a member of the channel
    if (exist_auth === 0) {
        return { error: 'error' };
    }

    return {
        messages: msgArray,
        start: start,
        end: endCopy,
    };
}

export { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1};

