import { channelDetailsV2 } from '../../channel/details/v2'
import { channelsCreateV2 } from '../../channels/create/v2'
import { userProfileV2 }    from '../../user/profile/v2'
import { authRegisterV2 }   from '../../auth/register/v2'

const request = require('sync-request');

const OK = 200;

describe('Testing basic functionality', () => {
    test('Detailing one channel', () => {
        authRegisterV2('email', 'password', 'nameFirst', 'nameLast');
        const user = userProfileV2('token', 0);
        channelsCreateV2('token', 'name', true);
        const res = request('GET','127.0.0.1:2000/src/channel/details/v2.ts', {
            qs: {
                token: 'Token',
                channelId: 0
            }
        });
        expect(res.statusCode).toBe(OK)
        expect(res.bodyObj).toStrictEqual({
            name: 'name',
            isPublic: true,
            ownerMembers: [user],
            allMembers: [user],
        })
    });
});