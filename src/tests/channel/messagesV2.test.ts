import { channelDetailsV2 } from '../../channel/details/v2'
import { channelsCreateV2 } from '../../channels/create/v2'
import { authRegisterV2 }   from '../../auth/register/v2'
import { messageSendV1 }    from '../../message/send/v1';

const request = require('sync-request');

const OK = 200;

describe('Testing basic functionality', () => {
    test('single message in channel', () => {
        const KevinIdToken = authRegisterV2('kevinyu@email.com', 'KevinsPassword0', 'Kevin', 'Yu');
        const {channelId} = channelsCreateV2(KevinIdToken.token, 'name', true);
        const {messageId.timeSent} = messageSendV1(KevinIdToken.token, channelId, 'Hello World!');
        const res = request('GET','127.0.0.1:2000/src/channel/messages/v2.ts', {
            qs: {
                token: KevinIdToken.token,
                channelId: channelId,
                start: 0
            }
        });
        expect(res.statusCode).toBe(OK);
        expect(channelDetailsV2(BobIdToken.token, channelId).messages).toStrictEqual({
            messages:   [
                {
                    messageId:  messageId,
                    uId:        KevinIdToken.uId,
                    message:    'Hello World!',
                    timeSent:   messageId.timeSent
                }
            ],
            start:      0,
            end:        -1
        });
    });
});