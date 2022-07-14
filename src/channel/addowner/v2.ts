import { getData, setData } from "../../dataStore";
import { tokenToAuthUserId, isTokenValid } from "../../token";
import { userProfileV1 } from "../../users";

export function channelAddOwnerV1(token: string, channelId: number, uId: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (authUserId === null) {
        return { error: 'error' }
    }
    const data = getData();
    const {user} = userProfileV1(authUserId, uId);
    data.channels[channelId].ownerMembers.push(user);
    setData(data);
    return {};
}
