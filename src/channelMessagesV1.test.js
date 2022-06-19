import { channelsListallV1} from './channels.js';
import { channelDetailsV1, channelMessagesV1} from './channel.js';

// If channelMessagesV1 was successful
test('Test successful channelMessagesV1', () => {
    const input = channelMessagesV1(12345, 6, 0);

    // End return as -1 because message array is empty in Iteration 1
    expect(input).toStrictEqual([], 0, -1);
});

// If the channelId does not refer to a valid channel
test('Test wrong channelId', () => {
    const input = channelMessagesV1(1, undefined, 0);
    const checkChannelId = channelsListallV1(1);
     // However in the spec it says channels is an array of objects?? do I use .toMatchObject then??
    expect(input).toEqual(expect.not.arrayContaining(checkChannelId));
    
    // can you do const errorOutput = expect(input).toEqual(expect.not.arrayContaining(checkChannelId));
    // then expect(errorOutput).toStrictEqual({error: 'error'})
    // or expect(input).toStrictEqual({error: 'error'})
});

// If start is greater than the total number of messages in the channel
test('Test if start value is greater than total number of messages', () => {
    const input = channelMessagesV1(1, 1, 1000);
    // is there a limit on how many total messages there could be
    
    // Error as message array will be empty in Iteration 1
    expect(input).toStrictEqual({error: 'error'})
});

// If the channelId is valid but authorised user is not a member
test('Test authId that is not a member of the channel', () => {
    const input = channelMessagesV1(1, 1, 0);
    const checkIfAuthMember = channelDetailsV1(2, 1);
    
    // Checking if authId is not in the allMembers array
    expect(input).toEqual(expect.not.arrayContaining(checkIfAuthMember));
});