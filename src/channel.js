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

    data.channels[channelId].allMembers.push( 
    {
        uId:        data.users[authUserId].uId,
        nameFirst:  data.users[authUserId].nameFirst,
        nameLast:   data.users[authUserId].nameLast,
        email:      data.users[authUserId].email,
    });

    setData();
    return {};
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

//  NEED DOCUMENTATION
function channelMessagesV1(authUserId, channelId, start) {
<<<<<<< HEAD
    
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

    // If the "start" value is greater than the total number of messages
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
        start: startCopy,
        end: endCopy,
    };
=======
    return 'authUserId' + 'channelId' + 'start';
>>>>>>> b4e5dd70504ecae1a6796762a7252581d1f3ae51
}
export { channelJoinV1, channelDetailsV1, channelMessagesV1, channelInviteV1};

