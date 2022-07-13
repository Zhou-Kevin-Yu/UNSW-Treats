import { appendFile } from "fs";
import { clearV1 } from "./other";
import { authRegisterV2 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListallV1 } from "./channels";
import { tokenToAuthUserId } from "./token";
import { userProfileV2 }    from '../../user/profile/v2'
import { channel } from "diagnostics_channel";

const request = require('sync-request');
const errorOutput = {error: "error"}

beforeEach(() => {
    clearV1();
});

describe('HTTP tests channelsCreateV2', () => {
    test('Valid testing', () => {
        let token = authRegisterV2(gary.sun@gmail.com, password, gary, sun).token
        let name = 'COMP1531';
        const res = req (
            'POST',
                '${url}:${port}/channelsCreateV2',
                {
                    qs: {
                        token: token,
                        name: name,
                        isPublic: true
                    }
                }

        )
    });
    expect(res.statusCode).toBe(200);
    expect(channels[0]).toBe(res.bodyObj);
       
});

describe('HTTP tests channelsListV2', () => {
    test('Valid testing', () => {
        let token = authRegisterV2(gary.sun@gmail.com, password, gary, sun).token
        let channel = channelCreateV2(token, COMP1531, isPublic)
        const res = req (
            'GET',
                '${url}:${port}/channelsListV2',
                {
                    qs: {
                        token: token
                    }
                }

        )
    });
    expect(res.statusCode).toBe(200);
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

describe('HTTP tests channelsListAllV2', () => {
    test('Valid testing', () => {

    let token = authRegisterV2('gary.sun@gmail.com', 'password', 'gary', 'sun').token
    let channel = channelCreateV2(token, 'COMP1531', true)
    let token1 = authRegisterV2('jeff.bezos@gmail.com', 'jesspassword','jeff' , 'bezos').token
    let channel1 = channelCreateV2(token1, 'COMP1521', true)
    const res = req (
        'GET',
            '${url}:${port}/channelsListAllV2',
            {
                qs: {
                    token: token
                }
            }

        )
    });
    expect(res.statusCode).toBe(200);
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



  


  

  ////////////////////////////////////////////////////////


  //wrapper functions

app.post('channels/create/V2', (req, res) = > {

    const { token, name, isPublic } = req.body;
    const authId = tokenToAuthUserId(token).authUserId;
    const channelId = channelsCreateV1(authId, name, isPublic);
    res.json(channelId);

});

app.get('channels/List/V2', (req, res) = > {

    const token = req.query;

    const channels = channelsListV1(token);

    return res.json(channels);
});

app.get('channels/ListAll/V2', (req, res) = > {

    const token = req.query;

    const channels = channelsListV1(token);

    return res.json(channels);
});


