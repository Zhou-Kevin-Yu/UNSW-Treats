  import { clearV1 }                          from './other.js'
  import { authRegisterV1 }                   from './auth.js'
  import { channelJoinV1 }                 from './channel.js'
  import { userProfileV1 }                    from './users.js'
  import { channelsCreateV1 }                 from './channels.js'


  const error = {error: 'error'}
  
  let authUserId, name, isPublic, channelId;
   
  beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    name =  'COMP1531'
    channelId = channelsCreateV1(authUserId, name, isPublic);
  });
  

  describe('Tests for return type for channelJoinV1', () => {
        
        test('No error output', () => {
        
            expect(channelJoinV1(authUserId, channelId)).toEqual('authUserIdchannelId');
            //expect(channelJoinV1(authUserId, channelId).toEqual({}));
        
        }); /*
  
        test('ChannelId does not refer to a valid channel', () => {
        
       // expect(channelDetailsV1(authUserId, 'fr31').toEqual(error));
        
        
        });
        
        test('User is already member of channel', () => {
        
        //expect(channelDetailsV1(authUserId, '0').toEqual(error));
        
        
        });
        
        test('Channel is private, and user isnt member nor owner', () => {
        
        expect(channelDetailsV1('ASc43', '0').toEqual(error));
        
        });*/
 
  
});



