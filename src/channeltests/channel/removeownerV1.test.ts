import { url, port }    from '../../config.json'
import { authRegisterV2ServerSide } from '../../wrapped.auth';
import { userProfileV2ServerSide } from '../../wrapped.user';

const request = require('sync-request');

const OK = 200;

beforeEach (() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing basic functionality', () => {
    test('Joining server with 1 owner member', () => {
        let res = request('POST', `${url}:${port}/auth/register/v2`,
        {
            json: {
                email: 'kevinyu@unsw.com',
                password: 'KevinsPassword0',
                nameFirst: 'Kevin',
                nameLast: 'Yu'
            }
        });
        const kevin = JSON.parse(res.body as string);
        console.log(kevin);
        res = request('POST', `${url}:${port}/auth/register/v2`,
        {
            json: {
                email: 'bob@unsw.com',
                password: 'BobsPassword0',
                nameFirst: 'Bob',
                nameLast: 'Smith'
            }
        });
        const bob = JSON.parse(res.body as string);
        const kevinProfile = userProfileV2ServerSide(kevin.token, kevin.authUserId);
        const bobProfile = userProfileV2ServerSide(bob.token, bob.authUserId);
        res = request('POST', `${url}:${port}/channels/create/v2`,
        {
            json: {
                token: kevin.token,
                name: 'name',
                isPublic: true
            }
        });
        const {channelId} = JSON.parse(res.body as string);
        res = request('POST', `${url}:${port}/channel/addowner/v1`,
        {
            json: {
                token: kevin.token,
                channelId: channelId,
                uId: bob.authUserId
            }
        });
        res = request('DELETE', `${url}:${port}/channel/removeowner/v1`,
        {
            json: {
                token: kevin.token,
                channelId: channelId,
                uId: bob.authUserId
            }
        });
        res = request('GET', `${url}:${port}/chanel/details/v2`,
        {
            qs: {
                token: kevin.token,
                channelId: channelId
            }
        });
        const data = res.body.toString();
        expect(data.allMembers).toStrictEqual([kevinProfile, bobProfile]);
        expect(data.ownerMembers).toStrictEqual([kevinProfile]);
        expect(res.statusCode).toBe(OK);
    });
});