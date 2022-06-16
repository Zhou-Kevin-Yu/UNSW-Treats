import { channelsCreateV1 } from channels.js;
import { clearV1 }          from other.js;
import { authRegisterV1 }   from auth.js;

beforeEach(() => {
    const Id = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    const input = {
        authUserId: Id,
        name:       undefined,
        isPublic:   true
    };
});


describe ('Testing return values', () => {
    //valid name test
    clearV1()
    test('valid channel name return value', () => {
        input.name = '1531';
        const noErrorOutput = 1;
        expect(channelsCreateV1(input)).toEqual(noErrorOutput);
    });

    //invalid name tests
    const errorOutput = { error: 'error' };
    clearV1();
    test('invalid channel name with less than 1 character return value', () => {
        input.name = '';
        expect(channelsCreateV1(input)).toEqual(errorOutput);
    });
    clearV1();
    test('invalid channel name with more than 20 chars return value', () => {
        input.name = '1234567891011121314151617181920';
        expect(channelsCreateV1(input)).toEqual(errorOutput);
    })
});


describe ('Testing channel creation', () => {
    const output = [
        {
            channelId:  1,
            name:       '1531'
        },
    ];
    clearV1();
    test('testing channel in channelsListV1', () => {
        channelsCreateV1(input);
        expect(channelsListV1(Id)).toEqual(output);
    });
});


/*const authRegisterInput = {
    email:      'gary.sun@student.unsw.edu.au',
    password:   '1b2#X',
    nameFirst:  'Gary',
    nameLast:   'Sun'
};

const authUserId = authRegisterV1({authRegisterInput});



describe ('Testing channel details', () => {
    input.name = '1531';
    const output = {
        name: '1531',
        isPublic: true,
        ownerMembers: [
        {
            uId:        authUserId,
            email:      'gary.sun@student.unsw.edu.au',
            nameFirst:  'Gary',
            nameLast:   'Sun',
            handleStr:  
        },
        ]
    };
    test('testing if channel is created with channelDetailsV1', () => {
        clearV1();
        const channelId = channelsCreateV1(input);
        expect()
    }

})*/