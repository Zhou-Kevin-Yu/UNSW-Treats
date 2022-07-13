
import { clearV1 } from "./other";
import { authRegisterV2 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListallV1 } from "./channels";

const errorOutput = {error: "error"}

beforeEach(() => {
    clearV1();
});


describe('Invalid inputs', () => {
    test('test invalid name (less than 1 chacaracter)', () => {

      let token = authRegisterV2(gary.sun@gmail.com, password, gary, sun).token
      let name = '';
      let isPublic = true;
      expect(channelCreateV2(token, name, isPublic)).toBe(errorOutput);
    });

    test('test invalid name (more than 20 chacaracters)', () => {

        let token = authRegisterV2(gary.sun@gmail.com, password, gary, sun).token
        let name = 'COMP1241241232141242142141233243121fesadad';
        let isPublic = true;
        expect(channelCreateV2(token, name, isPublic)).toBe(errorOutput);
      });

      test('test token (token doesnt exist)', () => {

        let token = '-42354213basfhidwied';
        let name = 'COMP1531';
        let isPublic = true;
        expect(channelCreateV2(token, name, isPublic)).toBe(errorOutput);
      });

  });
  

  describe('Valid inputs', () => {

    test('everything valid', () => {

        let token = authRegisterV2(gary.sun@gmail.com, password, gary, sun)
        let name = 'COMP1531';
        let isPublic = true;
        let cID = channelCreateV2(token.token, name, isPublic).channelId;
        let token1 = authRegisterV2(jeff.bezos@gmail.com, password54, jeff, bezos)
        let name1 = 'COMP1521';
        let isPublic1 = true;
        let cID1 = channelCreateV2(token1.token, name1, isPublic).channelId1;
        expect(channels[0].channelId).toBe(cID);
        expect(channels[1].channelId).toBe(cID1);
        expect(cID.channelId).toBe(0);
        expect(cID1.channelId).toBe(1);
        
      });

  });