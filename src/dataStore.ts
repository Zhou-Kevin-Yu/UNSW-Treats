// types here
export interface User {
  uId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
}

export interface UserDetailsV1 {
  user?:{
    uId: number;
    email: string;
    nameFirst: string;
    nameLast: string;
    handleStr: string;
  }
  error?: 'error';
}

export interface AuthLoginV1 {
  token?: string;
  authUserId?: number;
  error?: 'error';
}

export interface AuthRegisterV1 {
  token?: string;
  authUserId?: number;
  error?: 'error';
}

export interface ChannelJoinV1 {
  error?: 'error';
}

export interface ChannelInviteV1 {
  error?: 'error';
}

export interface ChannelDetailsV1 {
  name?: string;
  isPublic?: boolean;
  ownerMembers?: User[];
  allMembers?: User[]
  error?: 'error';
}

export interface MessagesObj {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
}

export interface ChannelMessagesV1 {
  messages?: MessagesObj[];
  start?: number;
  end?: number;
  error?: 'error';
}

export interface ChannelsCreateV1 {
  channelId?: number;
  error?: 'error';
}

export interface ChannelsObj {
  channelId: number;
  name: string;
}

export interface ChannelsListAllV1 {
  channels?: ChannelsObj[];
  error?: 'error';
}

export interface ChannelsListV1 {
  channels?: ChannelsObj[];
  error?: 'error';
}

interface UserObj {
  uId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  handleStr: string;
  password: string;
  permission: number;
  tokens: string[];
}

interface ChannelObj {
  channelId: number;
  name: string;
  isPublic: boolean;
  ownerMembers: {
    uId: number;
    email: string;
    nameFirst: string;
    nameLast: string;
    handleStr: string;
  } []
  allMembers: {
    uId: number;
    email: string;
    nameFirst: string;
    nameLast: string;
    handleStr: string;
  } []
  messages: MessagesObj[];
}

export interface Data {
  users: UserObj[];
  channels: ChannelObj[];
}

// YOU SHOULD MODIFY THIS OBJECT BELOW
let data: Data = {
  users: [],
  channels: [],
};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
<<<<<<< HEAD
function setData(newData: Data) {
=======
function setData(newData : Data) {
>>>>>>> 8b2a010672dcf972fa68fca5ac86c1e1e307d865
  data = newData;
}

export { getData, setData };
