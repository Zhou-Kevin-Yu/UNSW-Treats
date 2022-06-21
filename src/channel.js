import { getData, setData } from './dataStore.js'


function channelJoinV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

// 8.4. Documentation contribution

function channelInviteV1(authUserId, channelId, uId) {
    
    let data = getData();
    // THESE BELOW DO NOT WORK
    // If user Id is invalid
    /*if ((data.users).includes(uId) === false) {
        return { error: 'error' };
    }
    // If channel Id is invalid
    if ((data.channels).includes(channelId) === false) {
        return { error: 'error' };
    }*/
    
    // // To loop through all the existing channels 
    // for (let channel in data.channels) {
    //     // If the channel Id exists
    //     if (channelId === data.channels[channel].channelId) {
    //         // To loop through all the members in selected channel
    //         for (let member of data.channels[channel].allMembers) {
    //             // If user is already a member of the channel before the invite is sent
    //             if (uId === member.uId) {
    //                 return { error: 'error already member' };
    //             }
    //         }
    //     }

    // To loop through all the existing channels 
    for (let channel of data.channels) {
        // If the channel Id exists
        if (channelId === channel.channelId) {
            // To loop through all the members in selected channel
            for (let member of channel.allMembers) {
                // If user is already a member of the channel before the invite is sent
                if (uId === member.uId) {
                    return { error: 'error already member' };
                }
            }
        }
    } 
    // } 

    // To loop through all the existing channels 
    for (let channel of data.channels) {
        // If the channel Id exists
        if (channelId === channel.channelId) {
            // To loop through all the members in selected channel
            for (let member of channel.allMembers) {
                if (authUserId === member.uId) {
                    // Add user Id to members array in the channel
                    channel.allMembers.push(uId);
                    // Use set data after modifying data
                    setData(data);
                    return { };
                }
            }
            // If the auth user is not a member of the channel
            return { error: 'error auth user not member' };
        }
    } 

    // for debugging remove later
    return { error: 'error last' };
}

function channelDetailsV1(authUserId, channelId) {
    return 'authUserId' + 'channelId';
}

// doing this one
function channelMessagesV1(authUserId, channelId, start) {
    return 'authUserId' + 'channelId' + 'start';
}

export { channelJoinV1, channelInviteV1, channelDetailsV1, channelMessagesV1};


