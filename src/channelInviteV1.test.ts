import { authRegisterV1 }                       from './auth';
import { channelsCreateV1 }                     from './channels';
import { channelInviteV1 }                      from './channel';
// import { userProfileV1 }                        from './users.js';
import { clearV1 }                              from './other';

// Implement later
beforeEach(() => {
     clearV1();
});

// If channelInviteV1 was successful
describe ('Testing successful channelInviteV1', () => {
    clearV1();
    test('Test successful input example 1', () => {
        // Create an authUserId
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#$X', 'Gary', 'Sun');
        // Create an uId
        const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
        // Create a valid channelId
        const checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);

        // console.log("Channel ID IS", checkChannelId);

        const validChannelId = channelInviteV1(authUserId.authUserId, checkChannelId.channelId, userId.authUserId);
        const empty = { };
        // If no error, return an empty object
        expect(validChannelId).toEqual(empty);
    });

    clearV1();
    test('Test successful input example 2', () => {
        const authUserId = authRegisterV1('student.stu@student.unsw.edu.au', 'password', 'Stud', 'Studen');
        const userId = authRegisterV1("sen.smith@outlook.com", "peanutButter", "ben", "smith");
        const checkChannelId = channelsCreateV1(authUserId.authUserId, 'ECON1401', false);

        const validChannelId = channelInviteV1(authUserId.authUserId, checkChannelId.channelId, userId.authUserId);
        const empty = { };
        expect(validChannelId).toEqual(empty);
    });
});

// If the channelId does not refer to a valid channel 
describe ('Testing invalid channelId', () => {
    clearV1();
    test('Test undefined channelId', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '12345ASDFGG', 'Gary', 'Sun');
        // console.log('before making the second account');
        const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
        // const input = channelInviteV1(authUserId.authUserId, undefined, userId.authUserId);
        // expect(input).toStrictEqual({error: 'error'})
        // console.log('before testing chan invite');
        expect(() => channelInviteV1(authUserId.authUserId, undefined, userId.authUserId)).toThrow(Error);

    });
   
    clearV1();
    test('Test wrong channelId example 1', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '12345ASDFGG', 'Gary', 'Sun');
        const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
        let checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP2521', true);
        checkChannelId.channelId = checkChannelId.channelId + 1;
        
        // const input = channelInviteV1(authUserId.authUserId, checkChannelId.channelId, userId.authUserId);
        // expect(input).toStrictEqual({error: 'error'})
        expect(() => channelInviteV1(authUserId.authUserId, checkChannelId.channelId, userId.authUserId)).toThrow(Error);
    });

    clearV1();
    test('Test wrong channelId example 2', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '12345ASDFGG', 'Gary', 'Sun');
        const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
        let checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP2521', true);
        checkChannelId.channelId = checkChannelId.channelId - 1;
        
        // const input = channelInviteV1(authUserId.authUserId, checkChannelId.channelId, userId.authUserId);
        // expect(input).toStrictEqual({error: 'error'})
        expect(() => channelInviteV1(authUserId.authUserId, checkChannelId.channelId, userId.authUserId)).toThrow(Error);
    });
});

// If the uId does not refer to a valid user
describe ('Testing invalid uId', () => {
    clearV1();
    test('Test undefined uId', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '12345ASDFGG', 'Gary', 'Sun');
        const checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP1511', true);

        // let input = channelInviteV1(authUserId.authUserId, checkChannelId.channelId, undefined);
        // expect(input).toStrictEqual({error: 'error'})
        expect(() => channelInviteV1(authUserId.authUserId, checkChannelId.channelId, undefined)).toThrow(Error);
    });

    clearV1();
    test('Test null uId', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '12345ASDFGG', 'Gary', 'Sun');
        const checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP1511', true);

        // let input = channelInviteV1(authUserId.authUserId, checkChannelId.channelId, null);
        // expect(input).toStrictEqual({error: 'error'})
        expect(() => channelInviteV1(authUserId.authUserId, checkChannelId.channelId, null)).toThrow(Error);
    });
});

// If the user is already a member of the channel
test('Test uId that is already in channel', () => {
    clearV1();
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '12345ASDFGG', 'Gary', 'Sun');
    // const userId = authRegisterV1('gary.sun1@student.unsw.edu.au', '12345ASDFGG', 'Gary', 'Sun');
    const checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP1521', true);
    
    // authUserId and userId is the same therefore user is already a member
    // const input = channelInviteV1(authUserId.authUserId, checkChannelId.channelId, authUserId.authUserId);
    // expect(input).toStrictEqual({error: 'error'})
    expect(() => channelInviteV1(authUserId.authUserId, checkChannelId.channelId, authUserId.authUserId)).toThrow(Error);
});

// If the channelId is valid but authorised user is not a member
test('Test authId that is not a member of the channel', () => {
    clearV1();
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '12345ASDFGG', 'Gary', 'Sun');
    const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
    
    // Create channel with userId therefore authuserId is not a part of the channel
    const checkChannelId = channelsCreateV1(userId.authUserId, 'COMP1521', true);

    // const input = channelInviteV1(authUserId.authUserId, checkChannelId.channelId, userId.authUserId);
    // expect(input).toStrictEqual({error: 'error'})
    expect(() => channelInviteV1(authUserId.authUserId, checkChannelId.channelId, userId.authUserId)).toThrow(Error);
});