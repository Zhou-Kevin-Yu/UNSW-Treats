import { channelDetailsV1, channelInviteV1, channelMessagesV1 } from "../../../channel";
import { isTokenValid, tokenToAuthUserId } from "../../../token";
import { channelJoinV1 } from "../join/v1";

export function channelDetailsV2(token: string, channelId: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (authUserId === null) {
        return { error: 'error' };
    }
    return channelDetailsV1(authUserId, channelId);
}

export function channelInviteV2(token :string, channelId: number, uId: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (authUserId === null) {
        return { error: 'error' };
    }
    return channelInviteV1(authUserId, channelId, uId);
}

export function channelJoinV2(token :string, channelId: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (authUserId === null) {
        return { error: 'error' };
    }
    return channelJoinV1(token, channelId);
}

export function channelMessagesV2(token: string, channelId: number, start: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
        if (authUserId === null) {
            return { error: 'error' };
        }
    return channelMessagesV1(authUserId, channelId, start);
}
