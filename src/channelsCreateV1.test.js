import { channelsCreateV1, channelsListV1 } from './channels.js'
import { clearV1 }                          from './other.js'
import { authRegisterV1 }                   from './auth.js'
import { channelDetailsV1 }                 from './channel.js'
import { userProfileV1 }                    from './users.js'

let authUserId, name, isPublic;

beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    name;
    isPublic = true;
});


describe ('Testing return values', () => {
    //valid name test
    test('valid channel name return value', () => {
        name = '1531';
        const noErrorOutput = {channelId: 0}
        expect(channelsCreateV1(authUserId, name, isPublic)).toEqual(noErrorOutput);
    });

    //invalid name tests
    const errorOutput = { error: 'error' };
    test('invalid channel name with less than 1 character return value', () => {
        name = '';
        expect(channelsCreateV1(authUserId, name, isPublic)).toEqual(errorOutput);
    });
    test('invalid channel name with more than 20 chars return value', () => {
        name = '1234567891011121314151617181920';
        expect(channelsCreateV1(authUserId, name, isPublic)).toEqual(errorOutput);
    })
});


describe ('Testing channel creation', () => {
    const output = [
        {
            channelId:  0,
            name:       '1531'
        },
    ];
    test('testing channel in channelsListV1', () => {
        channelsCreateV1(authUserId, name, isPublic);
        expect(channelsListV1(authUserId)).toEqual(output);
    });
});

describe ('Testing channel details', () => {
    const user = userProfileV1(authUserId, authUserId);
    let output = {
        name:           '1531',
        isPublic:       true,
        ownerMembers:   [user],
        allMembers:     [user]
    };
    test('Public channel called "1531"', () => {
        channelsCreateV1(authUserId, name, isPublic);
        expect(channelDetailsV1(authUserId, 0)).toEqual(output);
    });
    output = {
        name:           'test channel',
        isPublic:       false,
        ownerMembers:   [user],
        allMembers:     [user]
    };
    test('Private channel called "test channel"', () => {
        channelsCreateV1(authUserId, name, isPublic);
        expect(channelDetailsV1(authUserId, 1)).toEqual(output);
    })
});
