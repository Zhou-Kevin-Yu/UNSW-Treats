channelsCreateV1:
No messages are in the channel when created.
Only 3 arguments are passeed into the function.
The creator of the channel is part ownerMembers.

In channelMessagesV1:
Return empty messsages array and end equal to -1 (instead of returnign error) for the edge case where 
if the start value is greater than 0 and equal to the total number of messages.
For example, if start is 1 and total message is 1, it should return an error
since the only message is at index 0.

nameFirst and nameLast does not contain special characters and numbers

channelsListV1:
Both public channels and private channels are returned in the channels array

that authRegisterV1 and authRegister return an object in the form {authUserId : 0}

currently, the first user in the system is an owner user.
