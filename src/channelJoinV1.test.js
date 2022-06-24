  import { clearV1 }                          from './other.js';
  import { authRegisterV1 }                   from './auth.js';
  import { channelJoinV1, channelDetailsV1 }                    from './channel.js';
  import { userProfileV1 }                    from './users.js';
  import { channelsCreateV1 }                 from './channels.js';

  const error = {error: 'error'};
  
  let authUserId, name, isPublic, channelId, authUserId2, channelId2;
   
  beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
    authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
  });

describe("Successful Outputs"), () => {

  test("successful single user channel join", () => {
    authUserId = authUserId.authUserId;
    channelId = channelId.channelId;
    const user = userProfileV1(authUserId, authUserId);

    channelJoinV1(authUserId, channelId);

    const channel = channelDetailsV1(authUserId, channelId);
    expect(channel.allMembers).toStrictEqual([user]);
  });

  test("successful double user channel join", () => {
    authUserId = authUserId.authUserId;
    authUserId2 = authUserId2.authUserId;
    channelId = channelId.channelId;
    const user1 = userProfileV1(authUserId, authUserId);
    const user2 = userProfileV1(authUserId2, authUserId2);

    channelJoinV1(authUserId, channelId);
    channelJoinV1(authUserId2, channelId);

    const channel = channelDetailsV1(authUserId, channelId);
    expect(channel.allMembers).toStrictEqual([user1, user2]);
  });
    
    test('No error output', () => {
      expect(channelJoinV1(authUserId2.authUserId, channelId.channelId)).toStrictEqual({});     
  }); 

}
test('ChannelId does not refer to a valid channel', () => {
  expect(channelJoinV1(authUserId.authUserId, 'CCMP1564')).toStrictEqual(error); 
});

test('User is already member of channel',   test("successful single user channel join", () => {
  authUserId = authUserId.authUserId;
  channelId = channelId.channelId;
  const user = userProfileV1(authUserId, authUserId);

  channelJoinV1(authUserId, channelId);

  const channel = channelDetailsV1(authUserId, channelId);
  expect(channel.allMembers).toStrictEqual([user]);
});

test("successful double user channel join", () => {
  authUserId = authUserId.authUserId;
  authUserId2 = authUserId2.authUserId;
  channelId = channelId.channelId;
  const user1 = userProfileV1(authUserId, authUserId);
  const user2 = userProfileV1(authUserId2, authUserId2);

  channelJoinV1(authUserId, channelId);
  channelJoinV1(authUserId2, channelId);

  const channel = channelDetailsV1(authUserId, channelId);
  expect(channel.allMembers).toStrictEqual([user1, user2]);
});
  
  test('No error output', () => {
    expect(channelJoinV1(authUserId2.authUserId, channelId.channelId)).toStrictEqual({});     
}); () => {
  expect(channelJoinV1(authUserId.authUserId, channelId.channelId)).toStrictEqual(error);
  expect(channelJoinV1(authUserId2.authUserId, channelId2.channelId)).toStrictEqual(error);    
});

test('Channel is private, and user isnt member nor owner', () => {
    let authUserId3 = authRegisterV1('random.name@student.unsw.edu.au', '1b2893#X', 'random', 'name');
    let channelId3 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
    expect(channelJoinV1(authUserId3.authUserId, channelId3.channelId)).toStrictEqual(error);    
});

test('Channel is private, and user not a member but is an owner', () => {
    //data.authuserId.authuserId.permission = 1
    // autherUser = 2
    let channelId3 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false); 
    expect(channelJoinV1(authUserId.authUserId, channelId3.channelId)).toStrictEqual({});    
});


