import { authRegisterV1 }                       from './auth.js';
import { channelsCreateV1 }                     from './channels.js';
import { channelInviteV1, channelDetailsV1 }    from './channel.js';
import { userProfileV1 }                        from './users.js';
import { clearV1 }                              from './other.js';

/*beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    name;
    isPublic = true;
});*/

// { authUserId, channelId, uId }
// If channelInviteV1 was successful
test('Test successful channelInviteV1', () => {
    // Create an authUserId
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    // Create an uId
    const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
    // Create a valid channelId
    const checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);

    const validChannelId = channelInviteV1(authUserId.authUserId, checkChannelId.channelId, userId.authUserId);
    const empty = { };
    // If no error, return an empty object
    expect(validChannelId).toEqual(empty);
});

// If the channelId does not refer to a valid channel 
describe ('Testing invalid channelId', () => {
    test('Test undefined channelId', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
        const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
        const input = channelInviteV1(authUserId, undefined, userId);
        expect(input).toStrictEqual({error: 'error'})
    });
   
    clearV1();
    // authUserId, channelId, uId
    test('Test wrong channelId', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
        const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
        let checkChannelId = channelsCreateV1(authUserId, 'COMP2521', true);
        checkChannelId = checkChannelId + 1;
        
        let input = channelInviteV1(authUserId, checkChannelId, userId);
        expect(input).toStrictEqual({error: 'error'})

        checkChannelId = checkChannelId - 2;
        input = channelInviteV1(authUserId, checkChannelId, userId);
        expect(input).toStrictEqual({error: 'error'})
    });
});

// If the uId does not refer to a valid user
describe ('Testing invalid uId', () => {
    test('Test undefined uId', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
        // const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
        const checkChannelId = channelsCreateV1(authUserId, 'COMP1511', true);

        const input = channelInviteV1(authUserId, checkChannelId, undefined);
        expect(input).toStrictEqual({error: 'error'})
    });

    clearV1();
    
    // NEED TO FIX THIS STUFF I DON'T THINK THE TEST BELOW MAKES SENSE
    test('Test wrong uId', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
        // const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
        const checkChannelId = channelsCreateV1(authUserId, 'COMP2511', true);
        
        // let checkUserId = userProfileV1(1, 3);
        // userId = userId + 1;
        
        // Haven't created a userId so would return error
        const input = channelInviteV1(authUserId, checkChannelId, 1);
        expect(input).toStrictEqual({error: 'error'})

        // userId = userId - 2;
        // checkUserId = userProfileV1(1, 1);
        // input = channelInviteV1(authUserId, checkChannelId, userId);
        // expect(input).toStrictEqual({error: 'error'})
    });
});

// NEED TO FIX THIS STUFF I DON'T THINK THE TEST BELOW MAKES SENSE
// If the user is already a member of the channel
test('Test uId that is already in channel', () => {
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    const userId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    const checkChannelId = channelsCreateV1(authUserId, 'COMP1521', true);
    
    // authUserId and userId is the same therefore user is already a member
    // const checkIfMember = channelDetailsV1(2, 1);
    const input = channelInviteV1(authUserId, checkChannelId, userId);
    expect(input).toStrictEqual({error: 'error'})
});

// NEED TO FIX THIS STUFF I DON'T THINK THE TEST BELOW MAKES SENSE
// If the channelId is valid but authorised user is not a member
test('Test authId that is not a member of the channel', () => {
    // similar thing and create two users using authRegisterV1 storing the userIds for later, 
    // get one to create a channel using channelCreateV1 and then test the output like you’ve done using channelInvite

    // trying to create an invite from the user that didn’t make the channel
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
    // Create channel with userId therefore authuserId is not a part of the channel
    const checkChannelId = channelsCreateV1(userId, 'COMP1521', true);

    // const checkIfAuthMember = channelDetailsV1(3, 1);
    const input = channelInviteV1(authUserId, checkChannelId, userId);
    expect(input).toStrictEqual({error: 'error'})
});