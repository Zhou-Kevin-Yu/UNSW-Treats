channelsCreateV1:
- No messages are in the channel when created.
- The creator of the channel is part of ownerMembers.

channelMessagesV1:
- Return empty messsages array and end equal to -1 (instead of returnign error) for the edge case where if the start value is greater than 0 and equal to the total number of messages.
  For example, if start is 1 and total message is 1, it should return an error since the only message is at index 0.


channelsListV1:
- Both public channels and private channels are returned in the channels array


General Assumptions:
- Parameteres aren't passed in as a single object containing keys and values, instead they are just those values
- all functions shouldn't expect a valid authUserId
- Return types are an object, with specified keys and values

*ITERATION 2 ASSUMPTIONS*
dm/create/v1:
- should throw an error if the user creating the dm is also in the uId array

dm/leave/v1
- when creator leave the dm, another person is promoted. This is decided by the order of which the creator made the dm.

dm/messages/v1
- start should cause a fail in the case when start = 1 and there is only one message. because start is the index and there is no message at index 1

General
- all tokens and authUserId has to be valid, otherwise we return { error }

channel/addowner/v1 & channel/removeowner/v1
- Global Owner can add and remove themselves as a channel owner

*ITERATION 3 ASSUMPTIONS *
message/pin/v1
- when message exists in a dm, all members are able to pin, not just the creator