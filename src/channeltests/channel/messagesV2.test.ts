import { url, port } from '../../config.json'

const request = require('sync-request');

const OK = 200;

beforeEach (() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing basic functionality', () => {
    test('single message in channel', () => {
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
        res = request('POST', `${url}:${port}/channels/create/v2`,
        {
            json: {
                token: kevin.token,
                name: 'name',
                isPublic: true
            }
        });
        const {channelId} = JSON.parse(res.body as string);
        res = request('POST', `${url}:${port}/message/send/v1`,
        {
            json: {
                token: kevin.token,
                channelId: channelId,
                message: 'Hello World'
            }
        });
        const {messageId} = JSON.parse(res.body as string);
        res = request('GET',`${url}:${port}/channel/messages/v2`,
        {
            qs: {
                token: kevin.token,
                channelId: channelId,
                start: 0
            }
        });
        res = request('GET', `${url}:${port}/channel/details/v2`,
        {
            qs: {
                token: kevin.token,
                channelId: channelId
            }
        });
        const data = JSON.parse(res.body as string);
        expect(data.messages).toStrictEqual({
            messages:   [
                {
                    messageId:  messageId,
                    uId:        kevin.uId,
                    message:    'Hello World!',
                    timeSent:   messageId.timeSent
                }
            ],
            start:      0,
            end:        -1
        });
    });
});