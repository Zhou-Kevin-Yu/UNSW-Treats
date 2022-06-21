import { channelsListV1, channelsCreateV1 } from './channels.js'
import { channelInviteV1 }                  from './channel.js'     
import { authRegisterV1 }                   from './auth.js'
import { clearV1 }                          from './other.js'



beforeEach(() => {
    clearV1();
});

test('Empty array of channels', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    expect(channelsListV1(authUserId)).toEqual({ channels: [] });
});


test('Single public channel in array', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    channelsCreateV1(authUserId, '1531', true);
    expect(channelsListV1(authUserId)).toEqual({ channels: [{ channelId: 0, name: '1531' }] });
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

/*test('multiple channnels in array, created by authUser and a different user', () => {
    const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XDne', 'Gary', 'Sun');
    channelsCreateV1(authUserId, '1531', true);
    channelsCreateV1(authUserId, 'test channel', true);
    const id = authRegisterV1('student.stu@student.unsw.edu.au', 'password', 'Stud', 'Studen');
    channelsCreateV1(id, 'test channel 1', true);
    channelInviteV1(id, 3, authUserId);

    const output = { channels: [
        {
            channelId:  0,
            name:       '1531'
        },
        {
            channelId:  1,
            name:       'test channel'
        },
        {
            channelId:  2,
            name:       'test channel 1'
        }
    ] };
    expect(channelsListV1(authUserId)).toEqual(output)
});*/