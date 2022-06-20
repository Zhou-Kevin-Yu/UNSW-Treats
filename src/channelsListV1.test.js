import { channelsListV1, channelsCreateV1 } from './channels.js'
import { channelInviteV1 }                  from './channel.js'     
import { authRegisterV1 }                   from './auth.js'
import { clearV1 }                          from './other.js'

let authUserId, Id, channelId;

beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
});

test('Empty array of channels', () => {
    expect(channelsListV1(authUserId)).toEqual([]);
});


test('Single public channel in array', () => {
    channelsCreateV1(authUserId, '1531', true);
    channelId = expect(channelsListV1(authUserId)).toEqual([{channelId: channelId, name: '1531'}]);
})

test('multiple channnels in array, created by authUser and a different user', () => {
    channelsCreateV1(authUserId, '1531', true);
    channelsCreateV1(authUserId, 'test channel', true);
    Id = authRegisterV1('student.stu@student.unsw.edu.au', 'password', 'Stud', 'Studen');
    channelsCreateV1(Id, 'test channel 1', true);
    channelInviteV1(Id, 3, authUserId);

    const output = [
        {
            channelId:  1,
            name:       '1531'
        },
        {
            channelId:  2,
            name:       'test channel'
        },
        {
            channelId:  3,
            name:       'test channel 1'
        }
    ];
    expect(channelsListV1(authUserId)).toEqual(output)
});