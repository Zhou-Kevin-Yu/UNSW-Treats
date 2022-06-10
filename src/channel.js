function channelMessagesV1 (authuserId, channelId, start) {
    return authuserId + channelId + start;
}

//stub for a function 'channelMessagesV1' with arguments named 'authUserId', 'channelId, 'start'
//returns a string concatenating the name 'authUserId', 'channelId, 'start' together
function channelMessagesV1(authUserId, channelId, start) {
    return 'authUserId' + 'channelId' + 'start';
}
function channelJoinV1(authUserId, channelId) {
    return authUserId + channelId;
}

function channelInviteV1(authUserId, channelId, uId) {
    return authUserId + channelId + uId;
}

function channelDetailsV1(authUserId, channelId) {
    return authUserId + channelId;
}