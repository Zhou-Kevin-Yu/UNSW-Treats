import { isTokenValid, tokenToAuthUserId } from './token';
import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';



function standupStartV1 (token: string, channelId: number, length: number): number{
    if (!isTokenValid(token)) {
        throw HTTPError(403, "Access Denied: Token is invalid");
    }

    // Check if length is valid
    if (length < 0) {
        throw HTTPError(400, "Enter in a length greater than 0");
    }

    const data = getData();

    // Check if channelId is valid
    if (!(channelId in data.channels)) {
        throw HTTPError(400, "Channel does not exist");
    }
    const channel = data.channels[channelId];
    const authUserId = tokenToAuthUserId(token, true);
    // Check if channelId is valid but authorised user is not part of channel
    if (!(channel.allMembers.some(member => member.uId === authUserId))) {
        throw HTTPError(403, "User isn't part of channel");
    }


    const standups = data.standups;
    // Check if there is already a standup for this channel
    if (standupActiveV1(token, channelId).isActive) {
        throw HTTPError(400, "There is already a standup for this channel");
    }

    return 0;
}

function standupActiveV1 (token: string, channelId: number){

    return {
        isActive: false,
        timeFinish: 0,
    };
};

function standupSendV1 (token: string, channelId: number, message: string) {

    return {};
}

export { standupStartV1, standupActiveV1, standupSendV1 };