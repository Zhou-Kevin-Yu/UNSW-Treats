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
    const channId = channelsCreateV1(authUserId, '1531', true);
    expect(channelsListV1(authUserId)).toStrictEqual({ channels: [{ channelId: channId, name: '1531' }] });
})

test('Multiple public channels in array', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    const channId0 = channelsCreateV1(authUserId, '1532', true);
    const channId1 = channelsCreateV1(authUserId, '1533', true);
    const channId2 = channelsCreateV1(authUserId, '1534', true);
    expect(channelsListV1(authUserId)).toStrictEqual({ channels: [
        {
            channelId:  channId0,
            name:       '1532'
        },
        {
            channelId:  channId1,
            name:       '1533'
        },
        {
            channelId:  channId2,
            name:       '1534'
        }
    ]
    })
});



test('Listing channels not created by authUser', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    const {id} = authRegisterV1('student@gmail.com', '1b2#XDne', 'Stud', 'Studen');
    const channId0 = channelsCreateV1(id, '1531', true);
    const channId1 = channelsCreateV1(id, '1532', true);
    const channId2 = channelsCreateV1(id, '1533', true);
    channelInviteV1(id, channId0, authUserId);
    channelInviteV1(id, channId1, authUserId);
    channelInviteV1(id, channId2, authUserId);
    expect(channelsListV1(authUserId)).toStrictEqual;({channels: [
        {
            channelId:  channId0,
            name:       '1531'
        },
        {
            channelId:  channId1,
            name:       '1532'
        },
        {
            channelId:  channId2,
            name:       '1533'
        }
    ]})
});

test('Listing channels created by both authUser and another user', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    const {id} = authRegisterV1('student@gmail.com', '1b2#XDne', 'Stud', 'Studen');
    const channId0 = channelsCreateV1(authUserId, '1531', true);
    const channId1 = channelsCreateV1(id, '1532', true);
    channelInviteV1(id, channId1, authUserId);
    const channId2 = channelsCreateV1(authUserId, '1533', true);
    expect(channelsListV1(authUserId)).toStrictEqual({channels: [
        {
            channelId:  0,
            name:       '1531'
        },
        {
            channelId:  1,
            name:       '1532'
        },
        {
            channelId:  2,
            name:       '1533'
        }
    ]});
});