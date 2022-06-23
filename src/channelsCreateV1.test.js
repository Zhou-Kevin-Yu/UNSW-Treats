import { channelsCreateV1, channelsListV1 } from './channels.js'
import { clearV1 }                          from './other.js'
import { authRegisterV1 }                   from './auth.js'
import { channelDetailsV1 }                 from './channel.js'
import { userProfileV1 }                    from './users.js'

let authUserId, name, isPublic;

beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@gmail.com', '1b2#XPS', 'Gary', 'Sun');
    name;
    isPublic = true;
});


describe ('Testing return values', () => {
    //valid name test
    test('valid channel name return value', () => {
        name = '1531';
        const noErrorOutput = { channelId: 0 }
        expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(noErrorOutput);
        name = '2'
        let output = { channelId: 1 }
        expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(output);
        name = '3'
        output = { channelId: 2 };
        expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(output);
    });

    //invalid name tests
    const errorOutput = { error: 'error' };
    test('invalid channel name with less than 1 character return value', () => {
        name = '';
        expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(errorOutput);
    });
    test('invalid channel name with more than 20 chars return value', () => {
        name = '1234567891011121314151617181920';
        expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(errorOutput);
    })
});


describe ('Testing channel creation', () => {
    const output = { channels: [
        {
            channelId:  0,
            name:       '1531'
        },
    ] };
    test('testing channel in channelsListV1', () => {
        const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XPS', 'Gary', 'Sun');
        name = '1531';
        channelsCreateV1(authUserId, name, isPublic);
        expect(channelsListV1(authUserId)).toStrictEqual(output);
    });
});

describe ('Testing channel details', () => {
    test('Public channel called "1531"', () => {
        const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XPS', 'Gary', 'Sun');
        const user = userProfileV1(authUserId, authUserId);
        name = '1531';
        isPublic = true;
        channelsCreateV1(authUserId, name, isPublic);
        expect(channelDetailsV1(authUserId, 0)).toStrictEqual({
            name:           '1531',
            isPublic:       true,
            ownerMembers:   [user],
            allMembers:     [user]
        });
    });
    test('Private channel called "test channel"', () => {
        const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XPS', 'Gary', 'Sun')
        const user = userProfileV1(authUserId, authUserId);
        name = 'test channel';
        isPublic = false;
        channelsCreateV1(authUserId, name, isPublic);
        expect(channelDetailsV1(authUserId, 0)).toStrictEqual({
            name:           'test channel',
            isPublic:       false,
            ownerMembers:   [user],
            allMembers:     [user]
        });
    })
});
