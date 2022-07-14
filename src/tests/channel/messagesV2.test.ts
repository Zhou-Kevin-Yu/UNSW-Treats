import { url, port } from '../../config.json'

const request = require('sync-request');

const OK = 200;

describe('Testing basic functionality', () => {
    test('single message in channel', () => {
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
        res = request('POST', `${url}:${port}/src/channels/create/v2`,
        {
            json: {
                token: kevin.token,
                name: 'name',
                isPublic: true
            }
        });
        const {cId} = res.getBody();
        res = request('POST', `${url}:${port}/src/message/send/v1`,
        {
            json: {
                token: kevin.token,
                channelId: cId,
                message: 'Hello World'
            }
        });
        const {messageId} = JSON.parse(res.getBody() as string);
        res = request('GET',`${url}:${port}/src/channel/messages/v2.ts`,
        {
            qs: {
                token: kevin.token,
                channelId: cId,
                start: 0
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
        
        expect(res.getBody().messages).toStrictEqual({
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