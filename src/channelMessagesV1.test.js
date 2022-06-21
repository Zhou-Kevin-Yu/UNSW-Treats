// import { channelsCreateV1 } from './channels.js';
// import { channelDetailsV1, channelMessagesV1} from './channel.js';
// import { clearV1 }                              from './other.js';

// // If channelMessagesV1 was successful
// test('Test successful channelMessagesV1', () => {
//     const input = channelMessagesV1(12345, 6, 0);

//     // End return as -1 because message array is empty in Iteration 1
//     expect(input).toStrictEqual([], 0, -1);
// });

// // If the channelId does not refer to a valid channel 
// describe ('Testing invalid channelId', () => {
//     test('Test undefined channelId', () => {
//         const input = channelMessagesV1(1, undefined, 0);
//         expect(input).toStrictEqual({error: 'error'})
//     });
   
//     clearV1();
//     test('Test wrong channelId', () => {
//         let checkChannelId = channelsCreateV1(1, 'Calvin', true);
//         checkChannelId = checkChannelId + 1;
        
//         const input = channelMessagesV1(1, 1, 0);
//         expect(input).toStrictEqual({error: 'error'})

//         checkChannelId = checkChannelId - 2;
//         expect(input).toStrictEqual({error: 'error'})
//     });
// });

// // If start is greater than the total number of messages in the channel
// test('Test if start value is greater than total number of messages', () => {
//     const input = channelMessagesV1(1, 1, 1000);
    
//     // Error as message array will be empty in Iteration 1
//     expect(input).toStrictEqual({error: 'error'})
// });

// // If the channelId is valid but authorised user is not a member
// test('Test authId that is not a member of the channel', () => {
//     const checkIfAuthMember = channelDetailsV1(3, 1);
//     const input = channelMessagesV1(1, 1, 0);
//     expect(input).toStrictEqual({error: 'error'})
// });