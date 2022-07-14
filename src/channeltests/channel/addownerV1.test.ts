import { url, port }      from '../../config.json'
import { clearV1 } from '../../other';
import request from 'sync-request';

const OK = 200;

beforeEach (() => clearV1());

describe('Testing basic functionality', () => {
    test('Adding 1 owner', () => {
        let res = request('POST', `${url}:${port}/auth/register/v2`,
        {
            json: {
                email: 'kevinyu@email.com',
                password: 'KevinsPassword0',
                nameFirst: 'Kevin',
                nameLast: 'Yu'
            }
        });
        const kevin = JSON.parse(res.getBody() as string);
        res = request('POST', `${url}:${port}/auth/register/v2`,
        {
            json: {
                email: 'bob@email.com',
                password: 'BobsPassword',
                nameFirst: 'Bob',
                nameLast: 'Smith'
            }
        });
        const bob = JSON.parse(res.getBody() as string);
        res = request('GET', `${url}:${port}/user/profile/v2`,
        {
            qs: {
                token:  kevin.token,
                uId:    kevin.uid
            }
        });
        const kevinProfile = JSON.parse(res.getBody() as string);
        res = request('GET', `${url}:${port}/user/profile/v2`,
        {
            qs: {
                token:  bob.token,
                uId:    bob.uid
            }
        });
        const bobProfile = JSON.parse(res.getBody() as string);
        res = request('POST', `${url}:${port}/channels/create/v2`,
        {
            json: {
                token: kevin.token,
                name: 'name',
                isPublic: true
            }
        });
        const {channelId} = JSON.parse(res.getBody() as string);
        res = request('POST', `${url}:${port}/channel/addowner/v1`,
        {
            qs: {
                token: kevin.token,
                channelId: channelId,
                uId: bob.uId
            }
        });
        expect(res.statusCode).toBe(OK);
        const data = JSON.parse(res.getBody() as string)
        expect(data.ownerMembers).toStrictEqual([kevinProfile, bobProfile])
    });
});