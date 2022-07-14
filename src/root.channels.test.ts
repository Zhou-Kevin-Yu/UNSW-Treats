
import { clearV1 } from "./other";
import { authRegisterV2 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListallV1 } from "./channels";
import { tokenToAuthUserId } from "./token";
import config from './config.json'
import os from 'os';

let port = config.port;
let url = config.url;
const request = require('sync-request');
const errorOutput = {error: "error"}

console.log(os.platform());


if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

function clearV1ServerSide() {
    request('DELETE', `${url}:${port}/clear/v1` );
}
  
beforeEach(() => {
    clearV1ServerSide();
});

describe('HTTP tests channelsCreateV2', () => {

    
    test('error output - invalid token to create channel', () => {

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: 'invalid token',
                name: 'COMP1531',
                isPublic: true
            }
        }
    )
    const channel = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(channel).toBe({errorOutput});

    });

    test('Testing invalid name inputs - less than 1 character', () => {

        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res.body as string);

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: '',
                isPublic: true
            }
        }
    )
    const channel = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(channel).toBe({errorOutput});

    });

    test('Testing invalid name inputs - more than 20 characters', () => {

        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res.body as string);

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'asdfghjkasdfghjkasdfghjkasdfghjksdfghj',
                isPublic: true
            }
        });
    const channel = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(channel).toBe({errorOutput});

    });

    test('no error output', () => {

        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res.body as string);

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
                json: {
                    token: authId.token,
                    name: 'COMP1531',
                    isPublic: true
                }
            }
        )
        const channel = JSON.parse(res.body as string);

        expect(res.statusCode).toBe(200);
        expect(channel.channelId).toBe({0});

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'COMP2521',
                isPublic: false
            }
        }
    )
        const channel1 = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(200);
        expect(channel.channelId).toBe({1});

    });
       
    test('Testing private channels', () => {

        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res.body as string);

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'COMP5642',
                isPublic: false
            }
        });
    const channel = JSON.parse(res.body as string);

    const res = req ('POST', `${url}:${port}/channels/create/V2`, {
        json: {
            token: authId.token,
            name: 'MATH1081',
            isPublic: true
        }
    });
    const channel_2 = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(channel.channelId).toBe(0);
    expect(channel_2.channelId).toBe(1);

    });

});

describe('HTTP tests channels/listV2', () => {

    //No error output can be tested

    test('No error output - checking if there are no channels', () => {
        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res.body as string);

        const res = req ('GET',`${url}:${port}/channels/listV2`, {
            qs: {
                token: authId.token,
            }
        });

        expect(res.statusCode).toBe(200);
        res = JSON.parse(res.body as string);

        expect(res.bodyObj).toStrictEqual({channels : []});

    });

    test('No error output - checking if it will only return channel user has joined', () => {
        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res.body as string);

        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
            email: 'jeff.bezos@gmail.com',
            password:  'jesspassword',
            nameFirst: 'jeff',
            nameLast: 'bezos'
            }
        });

        const authId2 = JSON.parse(res.body as string);

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'COMP1531',
                isPublic: true
            }
        });
        const channel = JSON.parse(res.body as string);

        const res = req ('GET',`${url}:${port}/channels/listV2`, {
            qs: {
                token: authId2.token,
            }
        });

        expect(res.statusCode).toBe(200);
        res = JSON.parse(res.body as string);

        expect(res.bodyObj).toStrictEqual({});

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId2.token,
                name: 'COMP1521',
                isPublic: true
            }
        });
        const channel2 = JSON.parse(res.body as string);

        expect(res.statusCode).toBe(200);
        res = JSON.parse(res.body as string);

        expect(res.bodyObj).toStrictEqual({ channels: [
            {
                channelId: channel2.channelId,
                name: 'COMP1521'
            }
        ]
        });
        
    });

    test('No error output', () => {
        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res.body as string);

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'COMP1531',
                isPublic: true
            }
        }
    )
        const channel = JSON.parse(res.body as string);

        const res = req ('GET',`${url}:${port}/channels/listV2`, {
            qs: {
                token: authId.token,
            }
        });

        expect(res.statusCode).toBe(200);
        res = JSON.parse(res.body as string);

        expect(res.bodyObj).toStrictEqual(
            { channels: [
                {
                    channelId: channel.channelId,
                    name: 'COMP1531'
                }
            ]}
        );
    });
    
       
});

describe('HTTP tests channelsListAllV2', () => {

    //No error output can be tested as this function does not return errors

    test('Successful list', () => {

        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res.body as string);

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
                json: {
                    token: authId.token,
                    name: 'COMP1531',
                    isPublic: true
                }
        });
        const channel = JSON.parse(res.body as string);

        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
            email: 'jeff.bezos@gmail.com',
            password:  'jesspassword',
            nameFirst: 'jeff',
            nameLast: 'bezos'
            }
        });

        const authId2 = JSON.parse(res.body as string);

        const res = req ('POST', `${url}:${port}/channels/create/V2`, {
                json: {
                    token: authId.token,
                    name: 'COMP1521',
                    isPublic: true
                }
        });
        const channel1 = JSON.parse(res.body as string);

        const res = req ('GET', `${url}:${port}/channels/listallV2`, {
                qs: {
                    token: authId.token
                }
            }

        )

        expect(res.statusCode).toBe(200);
        res = JSON.parse(res.body as string);

        expect(res.bodyObj).toStrictEqual(
            { channels: [
                {
                    channelId: channel.channelId,
                    name: 'COMP1531'
                },
                {
                    channelId: channel1.channelId,
                    name: 'COMP1521'
                }
            ]
            }
        );

        
    });

});
      
////////////////////////////wrapper functions

app.post('channels/create/V2', (req: Request, res: Response) = > {

    const { token, name, isPublic } = req.body;
    const authId = tokenToAuthUserId(token).authUserId;
    const channelId = channelsCreateV1(authId, name, isPublic).channelId;
    res.json(channelId);

});

app.get('channels/list/V2', (req, res) = > {

    const token = req.query;
    const authId = tokenToAuthUserId(token).authUserId;
    res.json(channelsListV1(authId));
});

app.get('channels/listall/V2', (req, res) = > {

    const token = req.query;
    const authId = tokenToAuthUserId(token).authUserId;
    res.json(channelsListAllV1(authId));
});*/
