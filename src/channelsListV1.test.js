import { channelsListV1, channelsCreateV1 } from './channels.js'
import { channelInviteV1 }                  from './channel.js'     
import { authRegisterV1 }                   from './auth.js'
import { clearV1 }                          from './other.js'



beforeEach(() => {
    clearV1();
});

test('Empty array of channels', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    expect(channelsListV1(authUserId)).toStrictEqual({ channels: [] });
});


test('Single public channel in array', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    channelsCreateV1(authUserId, '1531', true);
    expect(channelsListV1(authUserId)).toStrictEqual({ channels: [{ channelId: 0, name: '1531' }] });
})

test('Multiple public channels in array', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    channelsCreateV1(authUserId, 'COMP1532', true);
    channelsCreateV1(authUserId, 'COMP1533', true);
    channelsCreateV1(authUserId, 'COMP1534', true);
    expect(channelsListV1(authUserId)).toStrictEqual({ channels: [
        {
            channelId:  0,
            name:       'COMP1532'
        },
        {
            channelId:  1,
            name:       'COMP1533'
        },
        {
            channelId:  2,
            name:       'COMP1534'
        }
    ]
    })
});



test('Listing channels not created by authUser', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    const {'authUserId': id} = authRegisterV1('student@gmail.com', '1b2#XDne', 'Stud', 'Studen');
    const {'channelId': cId1} = channelsCreateV1(id, 'COMP1531', true);
    const {'channelId': cId2} = channelsCreateV1(id, 'COMP1532', true);
    const {'channelId': cId3} = channelsCreateV1(id, 'COMP1533', true);
    channelInviteV1(id, cId1, authUserId);
    channelInviteV1(id, cId2, authUserId);
    channelInviteV1(id, cId3, authUserId);
    expect(channelsListV1(authUserId)).toStrictEqual({channels: [
        {
            channelId:  cId1,
            name:       'COMP1531'
        },
        {
            channelId:  cId2,
            name:       'COMP1532'
        },
        {
            channelId:  cId3,
            name:       'COMP1533'
        }
    ]})
});

test('Listing channels created by both authUser and another user', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    const {'authUserId': id} = authRegisterV1('student@gmail.com', '1b2#XDne', 'Stud', 'Studen');
    channelsCreateV1(authUserId, 'COMP1531', true);
    channelsCreateV1(id, 'COMP1532', true);
    channelInviteV1(id, 1, authUserId);
    channelsCreateV1(authUserId, 'COMP1533', true);
    expect(channelsListV1(authUserId)).toStrictEqual({channels: [
        {
            channelId:  0,
            name:       'COMP1531'
        },
        {
            channelId:  1,
            name:       'COMP1532'
        },
        {
            channelId:  2,
            name:       'COMP1533'
        }
    ]})
})

test('multiple channnels in array, created by authUser and a different user', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    const {'authUserId': id} = authRegisterV1('student@gmail.com', '1b2#XDne', 'Stud', 'Studen');
    channelsCreateV1(authUserId, 'COMP1531', true);
    channelsCreateV1(authUserId, 'COMP1532', true);
    channelsCreateV1(id, 'COMP1533', true);
    channelInviteV1(id, 2, authUserId);
    expect(channelsListV1(authUserId)).toStrictEqual({ channels: [
        {
            channelId:  0,
            name:       'COMP1531'
        },
        {
            channelId:  1,
            name:       'COMP1532'
        },
        {
            channelId:  2,
            name:       'COMP1533'
        }
    ]
    })
});