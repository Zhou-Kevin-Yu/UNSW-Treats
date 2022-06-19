import { channelsCreateV1 }                     from './channels.js';
import { channelInviteV1, channelDetailsV1 }    from './channel.js';
import { userProfileV1 }                        from './users.js';
import { clearV1 }                              from './other.js';

// If channelInviteV1 was successful
test('Test successful channelInviteV1', () => {
    const validChannelId = channelInviteV1(1, 2, 1);
    const empty = {};
    expect(validChannelId).toEqual(empty);
});

// If the channelId does not refer to a valid channel 
describe ('Testing invalid channelId', () => {
    test('Test undefined channelId', () => {
        const input = channelInviteV1(1, undefined, 2);
        expect(input).toStrictEqual({error: 'error'})
    });
   
    clearV1();
    test('Test wrong channelId', () => {
        let checkChannelId = channelsCreateV1(1, 'Calvin', true);
        checkChannelId = checkChannelId + 1;
        
        const input = channelInviteV1(1, 1, 2);
        expect(input).toStrictEqual({error: 'error'})

        checkChannelId = checkChannelId - 2;
        expect(input).toStrictEqual({error: 'error'})
    });
});

// If the uId does not refer to a valid user
describe ('Testing invalid uId', () => {
    test('Test undefined uId', () => {
        const input = channelInviteV1(1, 1, undefined);
        expect(input).toStrictEqual({error: 'error'})
    });

    clearV1();
    test('Test wrong uId', () => {
        let checkUserId = userProfileV1(1, 3);
        const input = channelInviteV1(1, 1, 2);
        expect(input).toStrictEqual({error: 'error'})

        checkUserId = userProfileV1(1, 1);
        expect(input).toStrictEqual({error: 'error'})
    });
});


// If the user is already a member of the channel
test('Test uId that is already in channel', () => {
    const checkIfMember = channelDetailsV1(2, 1);
    const input = channelInviteV1(1, 1, 2);
    expect(input).toStrictEqual({error: 'error'})
});

// If the channelId is valid but authorised user is not a member
test('Test authId that is not a member of the channel', () => {
    const checkIfAuthMember = channelDetailsV1(3, 1);
    const input = channelInviteV1(5, 1, 4);
    expect(input).toStrictEqual({error: 'error'})
});