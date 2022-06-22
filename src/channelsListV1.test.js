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
    channelsCreateV1(authUserId, '1532', true);
    channelsCreateV1(authUserId, '1533', true);
    channelsCreateV1(authUserId, '1534', true);
    expect(channelsListV1(authUserId)).toStrictEqual({ channels: [
        {
            channelId:  0,
            name:       '1532'
        },
        {
            channelId:  1,
            name:       '1533'
        },
        {
            channelId:  2,
            name:       '1534'
        }
    ]
    })
});



test('Listing channels not created by authUser', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    const {id} = authRegisterV1('student@gmail.com', '1b2#XDne', 'Stud', 'Studen');
    channelsCreateV1(id, '1531', true);
    channelsCreateV1(id, '1532', true);
    channelsCreateV1(id, '1533', true);
    channelInviteV1(id, 0, authUserId);
    channelInviteV1(id, 1, authUserId);
    channelInviteV1(id, 2, authUserId);
    expect(channelsListV1(authUserId)).toStrictEqual;({channels: [
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
    ]})
});

test('Listing channels created by both authUser and another user', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    const {id} = authRegisterV1('student@gmail.com', '1b2#XDne', 'Stud', 'Studen');
    channelsCreateV1(authUserId, '1531', true);
    channelsCreateV1(id, '1532', true);
    channelInviteV1(id, 1, authUserId);
    channelsCreateV1(authUserId, '1533', true);
    console.log(channelsListV1(authUserId));
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
    ]})
})

/*test('multiple channnels in array, created by authUser and a different user', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    const {id} = authRegisterV1('student@gmail.com', '1b2#XDne', 'Stud', 'Studen');
    channelsCreateV1(authUserId, '1531', true);
    channelsCreateV1(authUserId, '1532', true);
    channelsCreateV1(id, '1533', true);
    channelInviteV1(id, 2, authUserId);
    expect(channelsListV1(authUserId)).toStrictEqual({ channels: [
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
    ]
    })
});*/