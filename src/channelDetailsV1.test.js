  import { clearV1 }                          from './other.js'
  import { authRegisterV1 }                   from './auth.js'
  import { channelDetailsV1 }                 from './channel.js'
  import { userProfileV1 }                    from './users.js'
  import { channelsCreateV1 }                 from './channels.js'

  const error = {error: 'error'}
  
  let authUserId, name, isPublic, channelId;
   
  beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b52#X', 'Gary', 'Sun');
    name =  'COMP1531';
    isPublic = true;
    channelId = channelsCreateV1(authUserId.authUserId, name, isPublic);
  });
  
               
  describe('Tests for return type for channelDetailsV1', () => {
     
        test('No error output', () => {  
                            
           expect(channelDetailsV1(authUserId.authUserId, channelId.channelId)).toEqual(
           expect.objectContaining({
                name: name,
                isPublic: isPublic,
                ownerMembers: expect.any(Array), 
                allMembers: expect.any(Array),
                  })
              );
        });
  
        test('ChannelId does not refer to a valid channel', () => {
        
        expect(channelDetailsV1(authUserId.authUserId, '-5')).toEqual(error);
 
        });
        
        test('ChannelId is valid, but user is not a member of the channel', () => {
        
        expect(channelDetailsV1('ASc43', channelId.channelId)).toEqual(error);
        
        });
 
  
});



