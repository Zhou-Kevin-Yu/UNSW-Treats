import { clearV1 }                          from './other.js';
import { authRegisterV1 }                   from './auth.js';
import { channelDetailsV1, channelJoinV1 }  from './channel.js';
import { userProfileV1 }                    from './users.js';
import { channelsCreateV1 }                 from './channels.js';
import { channelInviteV1 } from './channel.js';

const error = {error: 'error'};

let authUserId, name, isPublic, channelId, authUserId2, channelId2;

beforeEach(() => {
    clearV1();
    // authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    // channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
    // authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b23#X', 'random', 'name');
    // channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
});

describe('Testing proper channelDetailsV1', () => {
    test('2 channels created in the beforeEach', () => {

        authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
        channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
        authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b23#X', 'random', 'name');
        channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);

        
        const userObject = userProfileV1(authUserId.authUserId, authUserId.authUserId);
        console.log(userObject)
        expect(channelDetailsV1(authUserId.authUserId, channelId.channelId)).toStrictEqual(
            {
                name: 'COMP1531',
                isPublic: true,
                ownerMembers: [userObject],
                allMembers: [userObject],
            }
        )
    });

    test('2 people and 2 channels', () => {
        const {authUserId} = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
        const ss  = authRegisterV1('random.name@student.unsw.edu.au', '1b23ADFSDF#X8', 'random', 'name');
        console.log(ss)
        const authUserId2 = ss.authUserId
        console.log(authUserId2)
        const {channelId} = channelsCreateV1(authUserId, 'COMP1531', false);
        channelInviteV1(authUserId, channelId, authUserId2);

        const user1 = userProfileV1(authUserId, authUserId);
        const user2 = userProfileV1(authUserId2, authUserId2);
        console.log(user2)
        expect(user1.handleStr).toStrictEqual('garysun');
        expect(user2.handleStr).toStrictEqual('randomname');

        expect(channelDetailsV1(authUserId, channelId)).toStrictEqual(
            {
                name: 'COMP1531',
                isPublic: false,
                ownerMembers: [user1],
                allMembers: [user1, user2],
            }
        )
    });

        
});



            
// describe('Tests for return type for channelDetailsV1', () => {
//     test('No error output', () => {  
//         expect(channelDetailsV1(authUserId.authUserId, channelId.channelId)).toStrictEqual(
//             {
//                 name: 'COMP1531',
//                 isPublic: true,
//                 ownerMembers: expect.any(Array), 
//                 allMembers: expect.any(Array),                  
//             }
//         );
        
//         expect(channelDetailsV1(authUserId2.authUserId, channelId2.channelId)).toStrictEqual(
//             {
//                 name: 'COMP1542',
//                 isPublic: false,
//                 ownerMembers: expect.any(Array), 
//                 allMembers: expect.any(Array),
//             }
//         );
        
//     });

//     test('ChannelId does not refer to a valid channel', () => {
    
//         expect(channelDetailsV1(authUserId.authUserId, 'CCMP1541')).toStrictEqual(error); 
//     });
    
//     test('ChannelId is valid, but user is not a member of the channel', () => {
    
//         expect(channelDetailsV1(authUserId2.authUserId, channelId.channelId)).toStrictEqual(error);       
//         expect(channelDetailsV1(authUserId.authUserId, channelId2.channelId)).toStrictEqual(error);       
//     });

// });

