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

//  NEED DOCUMENTATION

function channelMessagesV1(authUserId, channelId, start) {
    
    let data = getData();
    let exist_channel = 0;
    let exist_auth = 0;
    let startCopy = start;
    let endCopy = startCopy + 50;
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
                    
                    // Loop to push messages into msgArray
                    for (let i = startCopy; i < endCopy; i++) {
                        msgArray.push(channel.messages[i]);
                    }

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
    
    // If the start value is greater than 0 and equal to the total number of messages
    // The first message in the array is at index 0
    // If start is equal to 1 and total message is equal to 1, it should return an error
    // Since the only message is at index 0
    if (start > 0 && start === msgArray.length) {
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
        start: startCopy,
        end: endCopy,
    };
}

export { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1};

