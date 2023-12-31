import { persistantSaveData } from './persistant';

// types here
export interface User {
  uId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
}

export interface UserDetailsV1 {
  user?: User;
  error?: 'error';
}

export interface UserAllV1 {
  users?: User[];
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
  error?: string;
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
  reacts: ReactObj[];
  isPinned: boolean;
}

export interface MessageLater {
  messageId: number;
  message: string;
  channelId: number;
  dmId: number;
}

export interface ReactObj {
  reactId: number;
  uIds: number[];
  isThisUserReacted: boolean;
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

////// Message Interfaces //////
// Iteration 3 Interfaces
export interface MessageShareV1 {
  sharedMessageId: number;
}

export interface MessageSendlaterV1 {
  messageId: number;
}
// Iteration 2 Interfaces
export interface MessageSendV1 {
  messageId?: number;
  error?: 'error';
}

export interface MessageEditV1 {
  error?: 'error';
}

export interface MessageRemoveV1 {
  error?: 'error';
}

export interface MessageSendDmV1 {
  messageId?: number;
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
export interface UserObj {
  uId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  handleStr: string;
  password: string;
  permission: number;
  tokens: string[];
  resetCodes: string[],
  profileImgUrl: string
}

interface ChannelObj {
  channelId: number;
  name: string;
  isPublic: boolean;
  ownerMembers: User[]
  allMembers: User[]
  messages: MessagesObj[];
}

export interface standupMsgObj {
  stdMsgId: number;
  handleStr: string;
  message: string;
}

export interface standupObj {
  standupId: number;
  channelId: number;
  timeStart: number;
  timeFinish: number;
  timeLength: number;
  standupMsgs: standupMsgObj[];
  startingUserId: number;
}

interface SystemInfo {
  messageTotal: number;
  globalOwners: number;
}

export interface Data {
  users: UserObj[];
  channels: ChannelObj[];
  dms: DmObj[];
  systemInfo: SystemInfo;
  standups: standupObj[];
  delayedMessages: MessageLater[];
}

// YOU SHOULD MODIFY THIS OBJECT BELOW
let data: Data = {
  users: [],
  channels: [],
  dms: [],
  systemInfo: {
    messageTotal: 0,
    globalOwners: 0,
  },
  standups: [],
  delayedMessages: [],
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
  // const readData = persistantReadData();
  // console.log('************ COMPARE *********************************');
  // console.log('Comparing file data and local data:');
  // console.log(readData);
  // console.log('__');
  // console.log(data);
  // data = { ...readData };
  // data = Object.assign(data, readData);
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData : Data) {
  persistantSaveData(newData);
  data = newData;
}

export { getData, setData };
