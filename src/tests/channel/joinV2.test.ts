import { url, port }      from '../../config.json'

const request = require('sync-request');

const OK = 200;

describe('Testing basic functionality', () => {
    test('Joining server with 1 owner member', () => {
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
        res = request('POST', `${url}:${port}/src/auth/register/v2`,
        {
            json: {
                email: 'bob@email.com',
                password: 'BobsPassword',
                nameFirst: 'Bob',
                nameLast: 'Smith'
            }
        });
        const bob = JSON.parse(res.getBody() as string);
        res = request('GET', `${url}:${port}/src/user/profile/v2`,
        {
            qs: {
                token:  kevin.token,
                uId:    kevin.uid
            }
        });
        const kevinProfile = JSON.parse(res.getBody() as string);
        res = request('GET', `${url}:${port}/src/user/profile/v2`,
        {
            qs: {
                token:  bob.token,
                uId:    bob.uid
            }
        });
        const bobProfile = JSON.parse(res.getBody() as string);
        res = request('POST', `${url}:${port}/src/channels/create/v2`,
        {
            json: {
                token: kevin.token,
                name: 'name',
                isPublic: true
            }
        });
        const {cId} = res.getBody();
        res = request('POST', `${url}:${port}/src/channel/join/v2`,
        {
            json: {
                token: bob.token,
                channelId: cId,
            }
        });
        expect(res.statusCode).toBe(OK);
        res = request('GET', `${url}:${port}/src/chanel/details/v2`,
        {
            qs: {
                token: kevin.token,
                channelId: cId
            }
        });
        expect(res.getBody().allMembers).toStrictEqual([kevinProfile, bobProfile])
    });
});