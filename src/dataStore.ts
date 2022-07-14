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

// DM interfaces
export interface Dm {
  dmId: number;
  name: string;
}

export interface DmCreateV1 {
  dmId?: number;
  error?: 'error';
}

export interface DmListV1 {
  dms?: Dm[];
  error?: 'error';
}

// export interface DmRemoveV1 {
//   error?: 'error';
// }

export interface DmDetailsV1 {
  name?: string;
  members?: User[];
  error?: 'error';
}

export interface DmLeaveV1 {
  error?: 'error';
}

export interface DmMessagesV1 {
  messages?: MessagesObj[];
  start?: number;
  end?: number;
  error?: 'error';
}

export interface DmObj {
  dmId: number;
  creator: number;
  members: number[];
  name: string;
  messages: MessagesObj[];
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
  ownerMembers: User[]
  allMembers: User[]
  messages: MessagesObj[];
}

interface SystemInfo {
  messageTotal: number;
}

export interface Data {
  users: UserObj[];
  channels: ChannelObj[];
  dms: DmObj[];
  systemInfo: SystemInfo;
}

// YOU SHOULD MODIFY THIS OBJECT BELOW
let data: Data = {
  users: [],
  channels: [],
  dms: [],
  systemInfo: {
    messageTotal: 0,
  }
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
function setData(newData : Data) {
  data = newData;
}

export { getData, setData };
