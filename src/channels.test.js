import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV1, channelsListallV1 } from '.channels';

beforeEach(() => {
    clearV1();
});

test('Test successful channel List', () => {
  const uId0 = authRegisterV1("ben.kerno@gmail.com", "dogIsCute", "benjamin", "kernohan").authUserId;
  const uId1 = authRegisterV1("ben.kerno1@gmail.com", "dogIsCute", "benjamin", "kernohan").authUserId;
  const chId0 = channelsCreateV1(uId0, "COMP6080", true).channelId;
  const chId1 = channelsCreateV1(uId1, "COMP1511", true).channelId;
  const channels = channelsListallV1(uId0).channels;
  expect(channels[0].channelId).toBe(chId0);
  expect(channels[1].channelId).toBe(chId1);
  expect(channels[0].name).toStrictEqual("COMP6080");
  expect(channels[1].name).toStrictEqual("COMP1511");
});

