import { url, port }      from '../../config.json'

const request = require('sync-request');

const OK = 200;

beforeEach (() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing basic functionality', () => {
    test('Joining server with 1 owner member', () => {
        let res = request('POST', `${url}:${port}/auth/register/v2`,
        {
            json: {
                email: 'kevinyu@email.com',
                password: 'KevinsPassword0',
                nameFirst: 'Kevin',
                nameLast: 'Yu'
            }
        });
        const kevin = JSON.parse(res.body as string);
        res = request('POST', `${url}:${port}/auth/register/v2`,
        {
            json: {
                email: 'bob@email.com',
                password: 'BobsPassword',
                nameFirst: 'Bob',
                nameLast: 'Smith'
            }
        });
        const bob = JSON.parse(res.body as string);
        res = request('GET', `${url}:${port}/user/profile/v2`,
        {
            qs: {
                token:  kevin.token,
                uId:    kevin.uid
            }
        });
        const kevinProfile = JSON.parse(res.body as string);
        res = request('POST', `${url}:${port}/channels/create/v2`,
        {
            json: {
                token: kevin.token,
                name: 'name',
                isPublic: true
            }
        });
        const channelId = JSON.parse(res.body as string).channelId;
        res = request('POST', `${url}:${port}/channel/invite/v2`,
        {
            json: {
                token: kevin.token,
                channelId: channelId,
                uId: bob.uId
            }
        });
        res = request('POST', `${url}:${port}/channel/leave/v1`,
        {
            json: {
                token: bob.token,
                channelId: channelId,
            }
        });
        expect(res.statusCode).toBe(OK);
        res = request('GET', `${url}:${port}/channel/details/v2`,
        {
            qs: {
                token: kevin.token,
                channelId: channelId
            }
        });
        const data = JSON.parse(res.body as string);
        expect(data.allMembers).toStrictEqual([kevinProfile])
    });
});