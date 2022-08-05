import { tokenToAuthUserId, isTokenValid } from './token';
import { getData } from './dataStore';
import HTTPError from 'http-errors';

function searchV1(token: string, query: string) {
    // check that token is valid
    // console.log("query", query);
    if (!isTokenValid(token)) {
        throw HTTPError(403, "Access Denied: Token is invalid");
    }
    const authUserId = tokenToAuthUserId(token, true);
    if (authUserId === null || authUserId === undefined) {
        throw HTTPError(403, "Access Denied: Token is invalid");
    }
    // check that the length of the query is less than 1 or greater than 1000
    if (query.length < 1 || query.length > 1000) {
        throw HTTPError(400, "Bad Request: Query is too long or too short");
    }
    const dataStore = getData();

    // search for the query in channels
    const channels = dataStore.channels;
    const usersChannels = channels.filter(channel => channel.allMembers.some(member => member.uId === authUserId));
    // console.log("usersChannels", usersChannels);
    let allChannelMessages = [];
    for (const channel of usersChannels) {
        for(const message of channel.messages) {
            allChannelMessages.push(message);
        }
    }
    // console.log("allChannelMessages", allChannelMessages);
    const queryMsgs = allChannelMessages.filter(msg => msg.message.includes(query));
    // console.log('queryMsgs', queryMsgs);


    // search for the query in messages
    const dms = dataStore.dms;
    const usersDms = dms.filter(dm => dm.members.includes(authUserId));
    // const allDmsMsgs = usersDms.map(dm => dm.messages.map(msg => msg));
    let allDmsMsgs = [];
    for (const dm of usersDms) {
        for(const msg of dm.messages) {
            allDmsMsgs.push(msg);
        }
    }
    const queryDmsMsgs = allDmsMsgs.filter(msg => msg.message.includes(query));

    const allQueryMsgs = [...queryMsgs, ...queryDmsMsgs];

    // console.log(allQueryMsgs);

    return {
        messages: allQueryMsgs,
    };
}

export { searchV1 };