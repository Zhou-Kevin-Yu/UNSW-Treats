import { channelMessagesV1 } from "../../channel";
import { isTokenValid, tokenToAuthUserId } from "../../token";

export function channelMessagesV2(token: string, channelId: number, start: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
        if (authUserId === null) {
            return { error: 'error' };
        }
    return channelMessagesV1(authUserId, channelId, start);
}
