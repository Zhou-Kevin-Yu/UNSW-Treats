
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
  
beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1` );
});

describe('HTTP tests channelsCreateV2', () => {

    
    test('error output - invalid token to create channel', () => {

        let res = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: 'invalid token',
                name: 'COMP1531',
                isPublic: true
            }
        }
    )
    let channel = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(channel).toBe({errorOutput});

    });

    test('Testing invalid name inputs - less than 1 character', () => {

        let res1 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        let authId = JSON.parse(res1.body as string);

        let res = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: '',
                isPublic: true
            }
        }
    )
        let channel = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(200);
        expect(channel).toBe({errorOutput});

    });

    test('Testing invalid name inputs - more than 20 characters', () => {

        let res1 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        let authId = JSON.parse(res1.body as string);

        let res = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'asdfghjkasdfghjkasdfghjkasdfghjksdfghj',
                isPublic: true
            }
        });
    let channel = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(200);
    expect(channel).toBe({errorOutput});

    });

    test('no error output', () => {

        let res1 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        let authId = JSON.parse(res1.body as string);

        let res2 = request('POST', `${url}:${port}/channels/create/V2`, {
                json: {
                    token: authId.token,
                    name: 'COMP1531',
                    isPublic: true
                }
            }
        )
        let channel = JSON.parse(res2.body as string);

        expect(res2.statusCode).toBe(200);
        expect(channel.channelId).toBe(0);

        let res3 = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'COMP2521',
                isPublic: false
            }
        }
    )
        let channel1 = JSON.parse(res3.body as string);
        expect(res3.statusCode).toBe(200);
        expect(channel.channelId).toBe(1);

        let res = request('GET', `${url}:${port}/channels/create/V2`, {
            qs: {
                token: authId.token,
                channelId: 0
            }
        });
        expect(res.statusCode).toBe(200)
        expect(res.bodyObj).toStrictEqual({
            name: 'COMP1531',
            isPublic: true,
            ownerMembers: [authId.authUserId],
            allMembers: [authId.authUserId],
    
        });

    });
       
    test('Testing private channels', () => {

        let res1 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res1.body as string);

        let res2 = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'COMP5642',
                isPublic: false
            }
        });
        const channel = JSON.parse(res2.body as string);

        let res = request('POST', `${url}:${port}/channels/create/V2`, {
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
        let res1 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res1.body as string);

        const res = request('GET',`${url}:${port}/channels/listV2`, {
            qs: {
                token: authId.token,
            }
        });

        expect(res.statusCode).toBe(200);
        let result = JSON.parse(res.body as string);

        expect(result).toStrictEqual({channels : []});

    });

    test('No error output - checking if it will only return channel user has joined', () => {
        let res1 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res1.body as string);

        let res2 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
            email: 'jeff.bezos@gmail.com',
            password:  'jesspassword',
            nameFirst: 'jeff',
            nameLast: 'bezos'
            }
        });

        const authId2 = JSON.parse(res2.body as string);

        let res3 = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'COMP1531',
                isPublic: true
            }
        });
        const channel = JSON.parse(res3.body as string);

        let res4 = request('GET',`${url}:${port}/channels/listV2`, {
            qs: {
                token: authId2.token,
            }
        });

        expect(res4.statusCode).toBe(200);
        let result = JSON.parse(res4.body as string);

        expect(result).toStrictEqual({});

        let res = request('POST', `${url}:${port}/channels/create/V2`, {
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
        let res1 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res1.body as string);

        const res2 = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId.token,
                name: 'COMP1531',
                isPublic: true
            }
        }
    )
        const channel = JSON.parse(res2.body as string);

        let res = request('GET',`${url}:${port}/channels/listV2`, {
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
    
    test('List channels that have been joined and invited to', () => {

        let res1 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId1 = JSON.parse(res1.body as string);

        let res2 = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId1.token,
                name: 'COMP1531',
                isPublic: true
            }
        }
    )
        const channel1 = JSON.parse(res2.body as string);

        let res3 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
            email: 'jeff.bezos@gmail.com',
            password:  'jesspassword',
            nameFirst: 'jeff',
            nameLast: 'bezos'
            }
        });

        const authId2 = JSON.parse(res3.body as string);

        let res4 = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId2.token,
                name: 'COMP2521',
                isPublic: true
            }
        });
        const channel2 = JSON.parse(res4.body as string);

        let res5 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
            email: 'randomy.guy@gmail.com',
            password:  'randompassword',
            nameFirst: 'random',
            nameLast: 'guy'
            }
        });

        const authId3 = JSON.parse(res5.body as string);

        const res = request('POST', `${url}:${port}/channels/create/V2`, {
            json: {
                token: authId3.token,
                name: 'COMP2521',
                isPublic: false
            }
        });
        const channel3 = JSON.parse(res.body as string);

        //use channel join
        //use channelinvite
        
        //channel 3 is pivate;


    });
    
       
});

describe('HTTP tests channelsListAllV2', () => {

    //No error output can be tested as this function does not return errors

    test('Successful list', () => {

        let res1 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res1.body as string);

        let res2 = request('POST', `${url}:${port}/channels/create/V2`, {
                json: {
                    token: authId.token,
                    name: 'COMP1531',
                    isPublic: true
                }
        });
        const channel = JSON.parse(res2.body as string);

        let res3 = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
            email: 'jeff.bezos@gmail.com',
            password:  'jesspassword',
            nameFirst: 'jeff',
            nameLast: 'bezos'
            }
        });

        const authId2 = JSON.parse(res3.body as string);

        let res4 = request('POST', `${url}:${port}/channels/create/V2`, {
                json: {
                    token: authId.token,
                    name: 'COMP1521',
                    isPublic: true
                }
        });
        const channel1 = JSON.parse(res4.body as string);

        let res5 = request('GET', `${url}:${port}/channels/listallV2`, {
                qs: {
                    token: authId.token
                }
            }

        )

        expect(res5.statusCode).toBe(200);
        let result = JSON.parse(res5.body as string);

        expect(result).toStrictEqual(
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

    test('Private channels', () => {





    });

});
