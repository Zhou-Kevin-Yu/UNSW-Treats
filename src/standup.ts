import { isTokenValid, tokenToAuthUserId } from './token';
import { getData, setData } from './dataStore';
import { standupObj, standupMsgObj } from './dataStore';
import { messageSendInsideStandup } from './message';
import HTTPError from 'http-errors';



function standupStartV1 (token: string, channelId: number, length: number) {
    console.log("token i've got: " + token);
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

    // Check if there is already a standup for this channel
    if (standupActiveV1(token, channelId).isActive) {
        throw HTTPError(400, "There is already a standup for this channel");
    }

    const newStandupObj: standupObj = {
        standupId: data.standups.length,
        channelId: channelId,
        timeStart: Math.floor((new Date()).getTime() / 1000),
        timeFinish: Math.floor((new Date()).getTime() / 1000) + length,
        timeLength: length,
        standupMsgs: [],
        startingUserId: authUserId,
    }
    data.standups.push(newStandupObj);
    setData(data);

    const pid = setTimeout(() => {
        console.log("token im seeing inside settimeout: " + token);

        // This is code that runs after standup is finished
        const newData = getData();
        const prevStandupObj = newData.standups.find(standup => standup.standupId === newStandupObj.standupId);
        if (prevStandupObj === undefined) {
            // throw HTTPError(400, "Standup no longer exists");
            // TODO - FIX ME 
            // return {
            //     timeFinish: newStandupObj.timeFinish
            // };
            return {};
            console.log("Standup no longer exists");
            clearInterval(pid);
            console.log("OR DOES IT??");
        }
        let standUpMsg = "";
        let standUpMsgArr = [];
        for (const standupMsg of prevStandupObj.standupMsgs) {
            standUpMsgArr.push(standupMsg.handleStr);
            standUpMsgArr.push(': ');
            standUpMsgArr.push(standupMsg.message);
            standUpMsgArr.push('\n');
        }
        standUpMsg = standUpMsgArr.join('');
        // TODO - send the actual message
        console.log("token im sending: " + token);
        const msgSender = messageSendInsideStandup(token, channelId, standUpMsg);
        if(msgSender.hasOwnProperty('error')) {
            return {};
            clearInterval(pid);
        }
        // Delete the standup
        newData.standups.splice(prevStandupObj.standupId, 1);
        setData(newData);
    }, length*1000);

    return {
        timeFinish: newStandupObj.timeFinish
    };
}

function standupActiveV1 (token: string, channelId: number){
    if (!isTokenValid(token)) {
        throw HTTPError(403, "Access Denied: Token is invalid");
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

    const standupObj = data.standups.find(standup => standup.channelId === channelId);

    const isActiveValue = standupObj !== undefined;
    const timeLeftValue = isActiveValue ? standupObj.timeFinish : null;
    return {
        isActive: isActiveValue,
        timeFinish: timeLeftValue,
    };
};

function standupSendV1 (token: string, channelId: number, message: string) {
    if (!isTokenValid(token)) {
        throw HTTPError(403, "Access Denied: Token is invalid");
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

    // Check if there is a standup for this channel
    if (!(standupActiveV1(token, channelId).isActive)) {
        throw HTTPError(400, "There is no standup for this channel");
    }
    // Check that the message length does not exceed 1000
    if (message.length > 1000) {
        throw HTTPError(400, "Message is too long");
    }

    const standupObj = data.standups.find(standup => standup.channelId === channelId);
    if (standupObj === undefined) {
        throw HTTPError(400, "Standup no longer exists");
    }

    const newStandupMsg: standupMsgObj = {
        stdMsgId: standupObj.standupMsgs.length,
        handleStr: data.users[authUserId].handleStr,
        message: message,
    }
    data.standups[standupObj.standupId].standupMsgs.push(newStandupMsg);
    setData(data);

    return {};
}

export { standupStartV1, standupActiveV1, standupSendV1 };