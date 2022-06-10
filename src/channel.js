function channelMessagesV1 (authuserId, channelId, start) {
    return authuserId + channelId + start;
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
