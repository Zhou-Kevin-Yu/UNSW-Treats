import { channelsCreateV2 } from '../../channels/create/v2'
import { url, port }        from '../../config.json'
import { clearV1 } from '../../other';

const request = require('sync-request');

const OK = 200;

beforeEach (() => clearV1());

describe('Testing basic functionality', () => {
    test('Detailing one channel', () => {
        let res = request('POST', `${url}:${port}/src/auth/register/v2`,
        {
            json: {
                email: 'kevinyu@email.com',
                password: 'KevinsPassword0',
                nameFirst: 'Kevin',
                nameLast: 'Yu'
            }
        });
        const kevin = JSON.parse(res.getBody() as string);
        res = request('GET', `${url}:${port}/user/profile/v2`,
        {
            qs: {
                token:  kevin.token,
                uId:    kevin.uid
            }
        });
        const {user} = JSON.parse(res.getBody() as string);
        res = request('POST',`${url}:${port}/channels/create/v2`, {
            json: {
                token: kevin.token,
                name: 'name',
                isPublic: 'true'
            }
        });
        res = request('GET', `${url}:${port}/channels/details/v2`, {
            qs: {
                token: kevin.token,
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