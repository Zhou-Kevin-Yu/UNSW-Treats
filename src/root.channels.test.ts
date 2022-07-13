import { clearV1 } from "./other";
import { authRegisterV2 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListallV1 } from "./channels";
import { tokenToAuthUserId } from "./token";
import { userProfileV2 } from './user.ts'
import config from './config.json'

//const app = express():
//app.use(express.json());

console.log(os.platform());

let port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

const request = require('sync-request');
const errorOutput = {error: "error"}

beforeEach(() => {
    clearV1();
});

describe('HTTP tests channelsCreateV2', () => {

    test('error output', () => {


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

        const res = req ('POST', `${url}:${port}/channels/Create/V2`, {
                json: {
                    token: authId.token,
                    name: 'COMP1531',
                    isPublic: true
                }
            }
        )
        const channel = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(200);

        expect(channel).toBe({
                channelId: 0,
                name: 'COMP1531'
            }
        );

    });
       

});

describe('HTTP tests channelsListV2', () => {

    test('error output', () => {


    });

    test('Valid testing', () => {
        let res = request('POST', `${url}:${port}/auth/register/v2`, {
            json: {
              email: 'gary.sun@gmail.com',
              password:  'password',
              nameFirst: 'gary',
              nameLast: 'sun'
            }
        });

        const authId = JSON.parse(res.body as string);

        const res = req ('POST', `${url}:${port}/channels/Create/V2`, {
            json: {
                token: authId.token,
                name: 'COMP1531',
                isPublic: true
            }
        }
    )
        const channel = JSON.parse(res.body as string);

        const res = req ('GET',`${url}:${port}/channelsListV2`, {
            qs: {
                token: authId.token,
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
                }
            ]
            }
        );
    });
    
       
});

describe('HTTP tests channelsListAllV2', () => {

    test('error output', () => {


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

        const res = req ('POST', `${url}:${port}/channels/Create/V2`, {
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

        const res = req ('POST', `${url}:${port}/channels/Create/V2`, {
                json: {
                    token: authId.token,
                    name: 'COMP1521',
                    isPublic: true
                }
        });
        const channel1 = JSON.parse(res.body as string);

        const res = req ('GET', `${url}:${port}/channelsListAllV2`, {
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

    );
      

  ////////////////////////////////////////////////////////


  //wrapper functions

app.post(`channels/create/V2`, (req, res) = > {

    const { token, name, isPublic } = req.body;
    const authId = tokenToAuthUserId(token).authUserId;
    const channelId = channelsCreateV1(authId, name, isPublic);
    res.json(channelId);

});

app.get(`channels/List/V2`, (req, res) = > {

    const token = req.query;
    const authId = tokenToAuthUserId(token).authUserId;
    const channels = channelsListV1(token);
    res.json(channels);
});

app.get(`channels/ListAll/V2`, (req, res) = > {

    const token = req.query;
    const authId = tokenToAuthUserId(token).authUserId;
    const channels = channelsListV1(token);
    res.json(channels);
});
