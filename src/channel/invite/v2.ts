import { channelInviteV1 } from '../../channel'
import { isTokenValid, tokenToAuthUserId } from '../../token'

export function channelInviteV2(token :string, channelId: number, uId: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (authUserId === null) {
        return { error: 'error' };
    }
    channelInviteV1(authUserId, channelId, uId);
}