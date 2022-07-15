import { url, port }      from '../../config.json'
import { clearV1 } from '../../other';
import { authRegisterV2ServerSide } from '../../wrapped.auth';
import { userProfileV2ServerSide } from '../../wrapped.user';

const request = require('sync-request');

const OK = 200;

beforeEach (() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing basic functionality', () => {
    test('Joining server with 1 owner member', () => {
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
        const {channelId} = res.getBody();
        res = request('POST', `${url}:${port}/src/channel/join/v2`,
        {
            json: {
                token: bob.token,
                channelId: channelId,
            }
        });
        expect(res.statusCode).toBe(OK);
        res = request('GET', `${url}:${port}/src/chanel/details/v2`,
        {
            qs: {
                token: kevin.token,
                channelId: channelId
            }
        });
        expect(res.getBody().allMembers).toStrictEqual([kevinProfile, bobProfile])
    });
});