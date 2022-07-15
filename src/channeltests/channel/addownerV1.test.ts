import { url, port }      from '../../config.json'
import { clearV1 } from '../../other';
import request from 'sync-request';
import { authRegisterV2ServerSide } from '../../wrapped.auth';
import { userProfileV2ServerSide } from '../../wrapped.user';

const OK = 200;

beforeEach (() => clearV1());

describe('Testing basic functionality', () => {
    test('Adding 1 owner', () => {
        const kevin = authRegisterV2ServerSide('kevin@email.com', 
                                                'KevinsPassword0', 'Kevin', 'Yu');
        const bob = authRegisterV2ServerSide('bob@email.com', 'BobsPassword0', 'Bob', 'Smith');
        const kevinProfile = userProfileV2ServerSide(kevin.token, kevin.authUserId);
        const bobProfile = userProfileV2ServerSide(bob.token, bob.authUserId);
        let res = request('POST', `${url}:${port}/channels/create/v2`,
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
            qs: {
                token: kevin.token,
                channelId: channelId,
                uId: bob.authUserId
            }
        });
        const data = JSON.parse(res.body as string);
        expect(data.ownerMembers).toStrictEqual([kevinProfile, bobProfile])
        expect(res.statusCode).toBe(OK);
    });
});