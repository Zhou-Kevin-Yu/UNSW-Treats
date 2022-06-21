import { authRegisterV1 }                       from './auth.js';
import { channelsCreateV1 }                     from './channels.js';
import { channelDetailsV1, channelMessagesV1}   from './channel.js';
import { clearV1 }                              from './other.js';

// If channelMessagesV1 was successful
describe ('Testing successful channelMessagesV1', () => {    
    clearV1();
    test('Test successful input example 1', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
        const validChannelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
        const success_input = channelMessagesV1(authUserId.authUserId, validChannelId.channelId, 0);
        
        // End return as -1 because message array is empty in Iteration 1
        expect(success_input).toStrictEqual({messages: [ ], start: 0, end: -1});
    });

    clearV1();
    test('Test successful input example 2', () => {
        const authUserId = authRegisterV1('student.stu@student.unsw.edu.au', 'password', 'Stud', 'Studen');
        const validChannelId = channelsCreateV1(authUserId.authUserId, 'ECON1401', false);
        const success_input = channelMessagesV1(authUserId.authUserId, validChannelId.channelId, 0);
        
        // End return as -1 because message array is empty in Iteration 1
        expect(success_input).toStrictEqual({messages: [ ], start: 0, end: -1});
    });
});

// If the channelId does not refer to a valid channel 
describe ('Testing invalid channelId', () => {
    clearV1();
    test('Test undefined channelId', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
        const input = channelMessagesV1(authUserId.authUserId, undefined, 0);
        expect(input).toStrictEqual({error: 'error'})
    });
   
    clearV1();
    test('Test wrong channelId example 1', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
        let checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP2511', true);
        checkChannelId.channelId = checkChannelId.channelId + 1;
        
        const input = channelMessagesV1(authUserId.authUserId, checkChannelId.channelId, 0);
        expect(input).toStrictEqual({error: 'error'})
    });

    clearV1();
    test('Test wrong channelId example 2', () => {
        const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
        let checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP2521', true);
        checkChannelId.channelId = checkChannelId.channelId - 4;
        
        const input = channelMessagesV1(authUserId.authUserId, checkChannelId.channelId, 0);
        expect(input).toStrictEqual({error: 'error'})
    });
});

// If start is greater than the total number of messages in the channel
test('Test if start value is greater than total number of messages', () => {
    clearV1();
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    const checkChannelId = channelsCreateV1(authUserId.authUserId, 'COMP1511', true);
    const input = channelMessagesV1(authUserId.authUserId, checkChannelId.channelId, 1000);

    // Error as message array will be empty in Iteration 1
    expect(input).toStrictEqual({error: 'error'})
});

// If the channelId is valid but authorised user is not a member
test('Test authId that is not a member of the channel', () => {
    clearV1();
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    const userId = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan");
    
    // Create channel with userId therefore authuserId is not a part of the channel
    const checkChannelId = channelsCreateV1(userId.authUserId, 'COMP1521', true);

    const input = channelMessagesV1(authUserId.authUserId, checkChannelId.channelId, 0);
    expect(input).toStrictEqual({error: 'error'})
});