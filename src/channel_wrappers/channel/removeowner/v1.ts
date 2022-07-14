import { getData, setData } from "../../dataStore";
import { tokenToAuthUserId, isTokenValid } from "../../token";
import { userProfileV1 } from "../../users";

export function channelRemoveOwnerV1(token: string, channelId: number, uId: number) {
    const authUserId = tokenToAuthUserId(token, isTokenValid(token));
    if (authUserId === null) {
        return { error: 'error' }
    }
    const data = getData();
    const ownerToBeRemoved = userProfileV1(authUserId, uId).user;
    data.channels[channelId].ownerMembers.filter( user => user !== ownerToBeRemoved);
    setData(data);
    return {};
}
