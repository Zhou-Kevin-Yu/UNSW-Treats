channelsCreateV1:
<<<<<<< HEAD
No messages are in the channel when created.
Only 3 arguments are passed into the function.
The creator of the channel is part ownerMembers.
=======
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
>>>>>>> e98b3f70c2fcad5b8873b39ceacc1f2dc5ea010d
