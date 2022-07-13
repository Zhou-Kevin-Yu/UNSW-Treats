import { channelDetailsV2 } from '../../channel/details/v2'
import { channelsCreateV2 } from '../../channels/create/v2'
import { userProfileV2 }    from '../../user/profile/v2'
import { authRegisterV2 }   from '../../auth/register/v2'
import { channelInviteV2 }  from '../../channel/invite/v2'

const request = require('sync-request');

const OK = 200;

describe('Testing basic functionality', () => {
    test('Single owner leaving', () => {
        const KevinIdToken = authRegisterV2('kevinyu@email.com', 'KevinsPassword0', 'Kevin', 'Yu');
        const BobIdToken = authRegisterV2('bob@email.com', 'BobsPassword', 'Bob', 'Smith');
        const kevin = userProfileV2(KevinIdToken.token, KevinIdToken.uId);
        const {channelId} = channelsCreateV2(KevinIdToken.token, 'name', true);
        channelInviteV2(KevinIdToken.token, channelId, BobIdToken.uId);
        const res = request('GET','127.0.0.1:2000/src/channel/leave/v1.ts', {
            qs: {
                token: KevinIdToken.token,
                channelId: channelId,
            }
        });
        expect(res.statusCode).toBe(OK);
        expect(channelDetailsV2(BobIdToken.token, channelId).ownerMembers).toStrictEqual(
            [bob]
        );
        expect(channelDetailsV2(BobIdToken.token, channelId).allMembers).toStrictEqual(
            [bob]
        )
    });
});