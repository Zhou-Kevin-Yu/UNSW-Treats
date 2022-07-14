import { channelDetailsV1 } from "../../channel";
import { tokenToAuthUserId, isTokenValid } from "../../token";

export function channelDetailsV2(token: string, channelId: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (authUserId === null) {
        return { error: 'error' };
    }
    return channelDetailsV1(authUserId, channelId);
}