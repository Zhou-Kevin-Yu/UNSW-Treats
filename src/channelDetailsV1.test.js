  import { clearV1 }                          from './other.js'
  import { authRegisterV1 }                   from './auth.js'
  import { channelDetailsV1 }                 from './channel.js'
  import { userProfileV1 }                    from './users.js'
  import { channelsCreateV1 }                 from './channels.js'


  const error = {error: 'error'}
  
  let authUserId, name, isPublic, channelId;
   
  beforeEach(() => {
    clearV1();
    authUserId = authRegisterV1('gary.sun@student.unsw.edu.au', '1b2#X', 'Gary', 'Sun');
    name =  'COMP1531'
    isPublic = true;
    channelId = channelsCreateV1(authUserId, name, isPublic);
  });
  

  describe('Tests for return type for channelDetailsV1', () => {
    
      const members = userProfileV1(authUserId, authUserId);

      let correctOutput = [
            {
              name: name,
              isPublic: isPublic,
              ownerMembers: [members], 
              allMembers: [members], 
            }
      ];
       
        
        test('No error output', () => {
        
            expect(channelDetailsV1(authUserId, channelId).toEqual(correctOutput));
        
        });
  
        test('ChannelId does not refer to a valid channel', () => {
        
        expect(channelDetailsV1(authUserId, '-5').toEqual(error));
        
        
        });
        
        test('ChannelId is valid, but user is not a member of the channel', () => {
        
        expect(channelDetailsV1('ASc43', channelId).toEqual(error));
        
        });
 
  
});



