import { url, port }      from '../../config.json'
import { clearV1 } from '../../other';
import { authRegisterV2ServerSide } from '../../wrapped.auth';
import { userProfileV2ServerSide } from '../../wrapped.user';

const request = require('sync-request');

const OK = 200;

beforeEach (() => clearV1());

describe('Testing basic functionality', () => {
    test('Adding 1 member', () => {
        const kevin = authRegisterV2ServerSide('kevinyu@email.com', 
                                                'KevinsPassword0', 'Kevin', 'Yu');
        const bob = authRegisterV2ServerSide('bob@email.com', 'BobsPassword', 'Bob', 'Smith');
        const kevinProfile = userProfileV2ServerSide(kevin.token, kevin.authUserId);
        const bobProfile = userProfileV2ServerSide(bob.token, bob.authUserId);
        let res = request('POST', `${url}:${port}/src/channels/create/v2`,
        {
            json: {
                token: kevin.token,
                name: 'name',
                isPublic: true
            }
        });
        const {channelId} = JSON.parse(res.body as string);
        res = request('POST', `${url}:${port}/src/channel/invite/v2`,
        {
            json: {
                token: kevin.token,
                channelId: channelId,
                uId: bob.authUserId
            }
        });
        res = request('GET', `${url}:${port}/src/chanel/details/v2`,
        {
            qs: {
                token: kevin.token,
                channelId: channelId
            }
        });
        const channel = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(OK);
        expect(channel.allMembers).toStrictEqual([kevinProfile, bobProfile])
        expect(channel.ownerMembers).toStrictEqual([kevinProfile, bobProfile])
    });
});