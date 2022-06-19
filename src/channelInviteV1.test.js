import { channelsCreateV1, channelsListallV1} from './channels.js';
import { channelInviteV1, channelDetailsV1 } from './channel.js';
import { userProfileV1 }          from './users.js';


// If channelInviteV1 was successful
test('Test successful channelInviteV1', () => {
    const noErrorOutput = 1;
    const validChannelId = channelInviteV1(1, 2, 1);
    expect(validChannelId).toEqual(noErrorOutput);
    
    // or is it expect(validChannelId).toEqual(' '); because a success case returns nothing?
});

// If the channelId does not refer to a valid channel 
test('Test wrong channelId', () => {
    const input = channelInviteV1(1, undefined, 2);
    const checkChannelId = channelsListallV1(1);
     // However in the spec it says channels is an array of objects?? do I use .toMatchObject then??
    expect(input).toEqual(expect.not.arrayContaining(checkChannelId));
    
    // can you do const errorOutput = expect(input).toEqual(expect.not.arrayContaining(channels));
    // then expect(errorOutput).toStrictEqual({error: 'error'})
    // or expect(input).toStrictEqual({error: 'error'})
});

// If the uId does not refer to a valid user
test('Test wrong uId', () => {
    const input = channelInviteV1(1, 1, undefined);
    const checkUserId = userProfileV1(1, 2);
    expect(input).toEqual(expect.not.objectContaining(checkUserId));
});

// If the user is already a member of the channel
test('Test uId that is already in channel', () => {
    const input = channelInviteV1(1, 1, 2);
    const checkIfMember = channelDetailsV1(1, 1);
    
    // Checking if uId is already in the allMembers array
    expect(input).toEqual(expect.arrayContaining(checkIfMember));
});

// If the channelId is valid but authorised user is not a member
test('Test uId that is already in channel', () => {
    const input = channelInviteV1(1, 1, 2);
    const checkIfAuthMember = channelDetailsV1(2, 1);
    
    // Checking if authId is not in the allMembers array
    expect(input).toEqual(expect.not.arrayContaining(checkIfAuthMember));
});




