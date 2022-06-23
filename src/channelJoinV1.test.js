  import { clearV1 }                          from './other.js';
  import { authRegisterV1 }                   from './auth.js';
  import { channelJoinV1 }                 from './channel.js';
  import { userProfileV1 }                    from './users.js';
  import { channelsCreateV1 }                 from './channels.js';

  const error = {error: 'error'};
  
  let authUserId, name, isPublic, channelId, authUserId2, channelId2;
   
  beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    channelId = channelsCreateV1(authUserId.authUserId, 'COMP1531', true);
    authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b23#X', 'random', 'name');
    channelId2 = channelsCreateV1(authUserId2.authUserId, 'COMP1542', false);
  });
  

    test('No error output', () => {
    
        expect(channelJoinV1(authUserId2.authUserId, channelId.channelId)).toStrictEqual({});     
    
    }); 

    test('ChannelId does not refer to a valid channel', () => {
    
         expect(channelJoinV1(authUserId.authUserId, 'CCMP1564')).toStrictEqual(error); 
    });
    
    test('User is already member of channel', () => {
    
        expect(channelJoinV1(authUserId.authUserId, channelId.channelId)).toStrictEqual(error);
        expect(channelJoinV1(authUserId2.authUserId, channelId2.channelId)).toStrictEqual(error);    
    });
    
    test('Channel is private, and user isnt member nor owner', () => {
      
        expect(channelJoinV1(authUserId.authUserId, channelId2.channelId)).toStrictEqual(error);    
    });


