import { getData, setData } from "../../dataStore";
import { tokenToAuthUserId, isTokenValid } from "../../token";
import { userProfileV1 } from "../../users";

export function channelJoinV1(token: string, channelId: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (authUserId === null) {
        return { error: 'error' }
    }
    const data = getData();
    const {user} = userProfileV1(authUserId, authUserId);
    data.channels[channelId].allMembers.push(user);
    setData(data);
    return {};
}
