  import { clearV1 }                          from './other.js';
  import { authRegisterV1 }                   from './auth.js';
  import { channelDetailsV1 }                 from './channel.js';
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
  
               
  describe('Tests for return type for channelDetailsV1', () => {
     
        test('No error output', () => {  
                            
            expect(channelDetailsV1(authUserId.authUserId, channelId.channelId)).toStrictEqual(
                {
                    name: 'COMP1531',
                    isPublic: true,
                    ownerMembers: expect.any(Array), 
                    allMembers: expect.any(Array),                  
                }
            );
            
            expect(channelDetailsV1(authUserId2.authUserId, channelId2.channelId)).toStrictEqual(
                {
                    name: 'COMP1542',
                    isPublic: false,
                    ownerMembers: expect.any(Array), 
                    allMembers: expect.any(Array),
                }
            );
            
        });
  
        test('ChannelId does not refer to a valid channel', () => {
        
            expect(channelDetailsV1(authUserId.authUserId, 'CCMP1541')).toStrictEqual(error); 
        });
        
        test('ChannelId is valid, but user is not a member of the channel', () => {
        
            expect(channelDetailsV1(authUserId2.authUserId, channelId.channelId)).toStrictEqual(error);       
            expect(channelDetailsV1(authUserId.authUserId, channelId2.channelId)).toStrictEqual(error);       
        });

});

