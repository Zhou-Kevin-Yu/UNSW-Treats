import { clearV1 } from '../other';
import { authRegisterV1 } from '../auth';
import { channelJoinV1, channelDetailsV1 } from '../channel';
import { userProfileV1 } from '../user';
import { channelsCreateV1 } from '../channels';

beforeEach(() => {
  clearV1();
});

describe('channelJoinV1 error cases', () => {
  test('channelId is invalid', () => {
    const { authUserId: ud1 } = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    expect(channelJoinV1(ud1, null)).toStrictEqual({ error: 'error' });
  });

  test('authUserId is invalid and so is channelId', () => {
    expect(channelJoinV1(null, null)).toStrictEqual({ error: 'error' });
  });

  test('authUserId is invalid', () => {
    const { authUserId: ud1 } = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    const { channelId: ch1 } = channelsCreateV1(ud1, 'COMP1521', true);
    expect(channelJoinV1(null, ch1)).toStrictEqual({ error: 'error' });
    expect(channelJoinV1(null, ch1)).toStrictEqual({ error: 'error' });
  });

  test('authorised user is already a member of the channel', () => {
    const { authUserId: ud1 } = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    const { channelId: ch1 } = channelsCreateV1(ud1, 'COMP1521', true);
    expect(channelJoinV1(ud1, ch1)).toStrictEqual({ error: 'error' });
  });

  // if (channel.private && authUser not in channel && authuser not global ) {
  test('private channel and user is not a member and isnt a global ownwer', () => {
    // ud1 is a global owner, based on an assumption that we make that the first ever user
    // is a global owner
    const { authUserId: ud1 } = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    const { channelId: ch1 } = channelsCreateV1(ud1, 'COMP1521', false);
    const { authUserId: ud2 } = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    expect(channelJoinV1(ud2, ch1)).toStrictEqual({ error: 'error' });
  });
});
describe('channelJoinV1 success cases', () => {
  test('private channel and user is not a member and is a global owner', () => {
    // ud1 is a global owner, based on an assumption that we make that the first ever user
    // is a global owner
    const { authUserId: ud1 } = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    const { authUserId: ud2 } = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    const { channelId: ch1 } = channelsCreateV1(ud2, 'COMP1521', false);
    expect(channelJoinV1(ud1, ch1)).toStrictEqual({});
    const user1 = userProfileV1(ud1, ud1).user;
    const user2 = userProfileV1(ud2, ud2).user;
    // console.log(channelDetailsV1(ud1, ch1));
    // console.log(({
    //   name: 'COMP1521',
    //   isPublic: false,
    //   ownerMembers: [user2],
    //   allMembers: [user1, user2],
    // }));
    expect(channelDetailsV1(ud1, ch1)).toStrictEqual({
      name: 'COMP1521',
      isPublic: false,
      ownerMembers: [user2],
      allMembers: [user2, user1],
    });
  });

  test('Adding a user to a public channel', () => {
    const { authUserId: ud1 } = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    const { authUserId: ud2 } = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    const { channelId: ch1 } = channelsCreateV1(ud1, 'COMP1521', true);
    expect(channelJoinV1(ud2, ch1)).toStrictEqual({});
    const user1 = userProfileV1(ud1, ud1).user;
    const user2 = userProfileV1(ud2, ud2).user;
    expect(channelDetailsV1(ud1, ch1)).toStrictEqual({
      name: 'COMP1521',
      isPublic: true,
      ownerMembers: [user1],
      allMembers: [user1, user2],
    });
  });

  test('Adding multiple users to a public channel', () => {
    const { authUserId: ud1 } = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    const { authUserId: ud2 } = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    const { authUserId: ud3 } = authRegisterV1('new.name@student.unsw.edu.au', '1b2893sdfsdf', 'new', 'name');
    const { channelId: ch1 } = channelsCreateV1(ud1, 'COMP1521', true);
    expect(channelJoinV1(ud2, ch1)).toStrictEqual({});
    expect(channelJoinV1(ud3, ch1)).toStrictEqual({});
    const user1 = userProfileV1(ud1, ud1).user;
    const user2 = userProfileV1(ud2, ud2).user;
    const user3 = userProfileV1(ud3, ud3).user;
    expect(channelDetailsV1(ud1, ch1)).toStrictEqual({
      name: 'COMP1521',
      isPublic: true,
      ownerMembers: [user1],
      allMembers: [user1, user2, user3],
    });
  });
});

describe('Manav testing', () => {
  const error = { error: 'error' };
  test('User is already member of channel', () => {
    // const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    // const channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
    const authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    const channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
    expect(channelJoinV1(authUserId2.authUserId, channelId2.channelId)).toStrictEqual(error);
  });

  test('Channel is private, and user isnt member nor owner', () => {
    // const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    // const channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
    const authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    // const channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
    const authUserId3 = authRegisterV1('randommmm.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    const channelId3 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
    expect(channelJoinV1(authUserId3.authUserId, channelId3.channelId)).toStrictEqual(error);
  });

  test('Channel is private, and user not a member but is an owner', () => {
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    // const channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
    const authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    // const channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
    const channelId3 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
    expect(channelJoinV1(authUserId.authUserId, channelId3.channelId)).toStrictEqual({});
  });

  test('successful single user channel join', () => {
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun').authUserId;
    const channelId = channelsCreateV1(authUserId, 'COMP1531', true).channelId;
    // const authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    // const channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
    const user = userProfileV1(authUserId, authUserId).user;

    channelJoinV1(authUserId, channelId);

    const channel = channelDetailsV1(authUserId, channelId);
    expect(channel.allMembers).toStrictEqual([user]);
  });

  test('successful double user channel join', () => {
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun').authUserId;
    const channelId = channelsCreateV1(authUserId, 'COMP1531', true).channelId;
    const authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name').authUserId;
    // const channelId2 = channelsCreateV1(authUserId2, 'COMP1542', false);
    const user1 = userProfileV1(authUserId, authUserId).user;
    const user2 = userProfileV1(authUserId2, authUserId2).user;

    channelJoinV1(authUserId, channelId);
    channelJoinV1(authUserId2, channelId);

    const channel = channelDetailsV1(authUserId, channelId);
    expect(channel.allMembers).toStrictEqual([user1, user2]);
  });

  test('No error output', () => {
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    const channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
    const authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    // const channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
    expect(channelJoinV1(authUserId2.authUserId, channelId.channelId)).toStrictEqual({});
  });

  test('ChannelId does not refer to a valid channel', () => {
    const authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    // const channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
    // const authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    // const channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
    expect(channelJoinV1(authUserId.authUserId, null)).toStrictEqual(error);
  });
});
