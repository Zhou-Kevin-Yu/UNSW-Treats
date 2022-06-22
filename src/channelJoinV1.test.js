  import { clearV1 }                          from './other.js'
  import { authRegisterV1 }                   from './auth.js'
  import { channelJoinV1 }                 from './channel.js'
  import { userProfileV1 }                    from './users.js'
  import { channelsCreateV1 }                 from './channels.js'

  const error = {error: 'error'}
  
  let authUserId, name, isPublic, channelId, authUserId2;
   
  beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b42#X', 'Gary', 'Sun');
    name =  'COMP1531';
    isPublic = true;
    channelId = channelsCreateV1(authUserId.authUserId, name, isPublic);
    authUserId2 = authRegisterV1('random.name@student.unsw.edu.au', '1b23#X', 'random', 'name');
  });
  

    test('No error output', () => {
    
        expect(channelJoinV1(authUserId2.authUserId, channelId.channelId)).toEqual({});     
    }); 

    test('ChannelId does not refer to a valid channel', () => {
    
         expect(channelJoinV1(authUserId.authUserId, 'fr31')).toEqual(error); 
    });
    
    test('User is already member of channel', () => {
    
        expect(channelJoinV1(authUserId.authUserId, channelId.channelId)).toEqual(error);
    });
    
    test('Channel is private, and user isnt member nor owner', () => {
       
        isPublic = false;
        let channelId2 = channelsCreateV1(authUserId.authUserId, name, isPublic);
        expect(channelJoinV1(authUserId2.authUserId, channelId2.channelId)).toEqual(error);    
    });


