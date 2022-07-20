import config from '../../config.json'

const request = require('sync-request');

import os from 'os';

const OK = 200;
const port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach (() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing basic functionality', () => {
    test('Detailing one channel', () => {
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
        res = request('GET', `${url}:${port}/user/profile/v2`,
        {
            qs: {
                token:  kevin.token,
                uId:    kevin.authUserId
            }
        });
        const {user} = JSON.parse(res.body as string);
        res = request('POST',`${url}:${port}/channels/create/v2`, {
            json: {
                token: kevin.token,
                name: 'name',
                isPublic: true
            }
        });
        res = request('GET', `${url}:${port}/channel/details/v2`, {
            qs: {
                token: kevin.token,
                channelId: 0
            }
        });
        const data = JSON.parse(res.body as string)
        expect(data).toStrictEqual({
            name: 'name',
            isPublic: true,
            ownerMembers: [user],
            allMembers: [user],
        })
    });
    test('invalid channelId', () => {
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
        res = request('GET', `${url}:${port}/user/profile/v2`,
        {
            qs: {
                token:  kevin.token,
                uId:    kevin.authUserId
            }
        });
        const {user} = JSON.parse(res.body as string);
        res = request('GET', `${url}:${port}/channel/details/v2`, {
            qs: {
                token: kevin.token,
                channelId: 0
            }
        });
        const data = JSON.parse(res.body as string)
        expect(data).toStrictEqual({error: 'error'})
    })
});