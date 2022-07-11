import { channelsCreateV1, channelsListV1 } from './channels'
import { clearV1 }                          from './other'
import { authRegisterV1 }                   from './auth'
import { channelDetailsV1 }                 from './channel'
import { userProfileV1 }                    from './users'

let authUserId, name, isPublic;

beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@gmail.com', '1b2#XPS', 'Gary', 'Sun').authUserId;
    name;
    isPublic = true;
});


describe ('Testing return values', () => {
    //valid name test
    test('valid channel name return value', () => {
        name = '1531';
        let output = { channelId: 0 }; //channelIDs are incremented starting at 0 for the first channel created
        expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(output);
        name = '2'
        output = { channelId: 1 }
        expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(output);
        name = '3'
        output = { channelId: 2 };
        expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(output);
    });

    //invalid name tests
    // const error = { error: 'error' };
    test('invalid channel name with less than 1 character return value', () => {
        name = '';
        // expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(error);
        expect(() => channelsCreateV1(authUserId, name, isPublic)).toThrow(Error);
    });
    test('invalid channel name with more than 20 chars return value', () => {
        name = '1234567891011121314151617181920';
        // expect(channelsCreateV1(authUserId, name, isPublic)).toStrictEqual(error);
        expect(() => channelsCreateV1(authUserId, name, isPublic)).toThrow(Error);
    })
});


describe ('Testing channel creation', () => {
    test('testing channel in channelsListV1', () => {
        const output = { channels: [
            {
                channelId:  0,
                name:       'COMP1531'
            },
        ] };
        // const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XPS', 'Gary', 'Sun'); //this doubles up authUserId because of the beforeEach();
        name = 'COMP1531';
        // console.log(authUserId);
        channelsCreateV1(authUserId, name, isPublic);
        expect(channelsListV1(authUserId)).toStrictEqual(output);
    });
});

describe ('Testing channel details', () => {
    test('Public channel called "COMP1531"', () => {
        // const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XPS', 'Gary', 'Sun');
        const user = userProfileV1(authUserId, authUserId).user;
        name = 'COMP1531';
        isPublic = true;
        const channelId = channelsCreateV1(authUserId, name, isPublic).channelId;
        expect(channelDetailsV1(authUserId, channelId)).toStrictEqual({
            name:           'COMP1531',
            isPublic:       true,
            ownerMembers:   [user],
            allMembers:     [user]
        });
    });
    test('Private channel called "ENGG9876"', () => {
        //const {authUserId} = authRegisterV1('gary.sun@gmail.com', '1b2#XPS', 'Gary', 'Sun')
        const user = userProfileV1(authUserId, authUserId).user;
        name = 'ENGG9876';
        isPublic = false;
        const channelId = channelsCreateV1(authUserId, name, isPublic).channelId;
        expect(channelDetailsV1(authUserId, channelId)).toStrictEqual({
            name:           'ENGG9876',
            isPublic:       false,
            ownerMembers:   [user],
            allMembers:     [user]
        });
    })
});
