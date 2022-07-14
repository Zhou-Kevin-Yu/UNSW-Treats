import { getData, setData } from "../../dataStore";
import { tokenToAuthUserId, isTokenValid } from "../../token";
import { userProfileV1 } from "../../users";

export function channelLeaveV1(token: string, channelId: number, uId: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (authUserId === null) {
        return { error: 'error' }
    }
    const data = getData();
    const authUser = userProfileV1(authUserId, authUserId).user;
    data.channels[channelId].allMembers.filter(user => user !== authUser);
    setData(data);
    return {};
}
