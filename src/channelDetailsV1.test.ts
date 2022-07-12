import { clearV1 }                          from './other';
import { authRegisterV1 }                   from './auth';
import { channelDetailsV1, channelJoinV1 }  from './channel';
import { userProfileV1 }                    from './users';
import { channelsCreateV1 }                 from './channels';
import { channelInviteV1 } from './channel';

const error = {error: 'error'};

beforeEach(() => {
    clearV1();
});

describe('Testing proper channelDetailsV1', () => {
    test('2 channels created in the beforeEach', () => {
        let authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
        let channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
        
        const userObject = userProfileV1(authUserId.authUserId, authUserId.authUserId).user;
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
        const authUserId2 = ss.authUserId
        const {channelId} = channelsCreateV1(authUserId, 'COMP1531', false);
        channelInviteV1(authUserId, channelId, authUserId2);

        const user1 = userProfileV1(authUserId, authUserId).user;
        const user2 = userProfileV1(authUserId2, authUserId2).user;
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

describe('Tests for return type for channelDetailsV1', () => {
    test('ChannelId does not refer to a valid channel', () => {
        let authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
        channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
        expect(channelDetailsV1(authUserId.authUserId, null)).toStrictEqual(error); 
    });
    
    test('ChannelId does not refer to a valid channel2', () => {
        let authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
        channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
        let cId = channelsCreateV1(authUserId.authUserId, 'ENGG1000', true).channelId;
        expect(channelDetailsV1(authUserId.authUserId, null)).toStrictEqual(error); 
    });
    test('invalid authUserId', () => {
        let authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
        let cId = channelsCreateV1(authUserId.authUserId, 'ENGG1000', true).channelId;
        expect(channelDetailsV1(null, cId)).toStrictEqual(error); 
    });

    test('ChannelId is valid, but user is not a member of the channel', () => {
        let authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
        let channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
        let authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b23#X', 'random', 'name');
        let channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
        expect(channelDetailsV1(authUserId2.authUserId, channelId.channelId)).toStrictEqual(error);       
        expect(channelDetailsV1(authUserId.authUserId, channelId2.channelId)).toStrictEqual(error);       
    });

});

