import { userProfileV1 } from "./users";
import { authRegisterV1 } from "./auth";

describe('userProfileV1 - testing invalid operations', () => {
    test('Invalid authUserId and uId', () => {
        expect(() => {
            userProfileV1(1, 1);
        }).toStrictEqual({ error: 'error' });
    });

    test('Invalid authUserId', () => {
        const {uId} = authRegisterV1('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
        expect(() => {
            userProfileV1(null, uId);
        }).toStrictEqual({ error: 'error' });
    });

    test('Invalid uId', () => {
        const {authUserId} = authRegisterV1('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
        expect(() => {
            userProfileV1(authUserId, null);
        }).toStrictEqual({ error: 'error' });
    });
});

describe('userProfileV1 - testing valid operations', () => {
    test('Valid authUserId and uId = authUserId', () => {
        const {authUserId} = authRegisterV1('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
        expect(() => {
            userProfileV1(authUserId, authUserId);
        }).toStrictEqual({
            uId: authUserId,
            email: 'gary.sun@student.unsw.edu.au',
            nameFirst: 'Gary',
            nameLast: 'Sun',
            handleStr: 'Gazza',
        });
    });

    test('Valid authUserId and uId', () => {
        const {authUserId} = authRegisterV1('gary.sun@student.unsw.edu.au', 'bird27', 'Gary', 'Sun');
        const {uId} = authRegisterV1('manav.pawar@student.unsw.edu.au', 'mjerry', 'Manav', 'Pawar');
        expect(() => {
            userProfileV1(authUserId, uId);
        }).toStrictEqual({
            uId: uId,
            email: 'manav.pawar@student.unsw.edu.au',
            nameFirst: 'Manav',
            nameLast: 'Pawar',
            handleStr: 'manny',
        });
    });
});