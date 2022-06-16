import { clearV1 } from './other';
import { getData, setData } from './dataStore';

test('Test successful user clear', () => {
  clearV1();
  const data = getData();
  console.log(data)
  data.users['test@dream.com'] = {
    userId: 1,
    password: "password",
    name: 'master tetik',
  };
  const dataInit = data;
  setData(data);

  // //test here to see if data is correctly set
  const dataPull = getData();
  let dataTrue = 
  {users: {
    'test@dream.com': {
      userId: 1,
      password: 'password', 
      name: 'master tetik' 
      }
    },
  channels: {}
  }

  console.log(dataPull);
  expect(dataPull).toStrictEqual(dataTrue);
  
  //test if clearV1 works
  clearV1();
  const dataNew = getData();
  dataTrue = { users: {}, channels: {} }
  expect(dataNew).toStrictEqual(dataTrue);
});

test('Test successful channel clear', () => {
  clearV1();
  const data = getData();
  console.log(data)
  data.channels['COMP1531'] = {
    channelId: 1,
    isPublic: false,
    usersOnline: 4,
  };
  const dataInit = data;
  setData(data);

  // //test here to see if data is correctly set
  const dataPull = getData();
  let dataTrue = 
  {channels: {
    'COMP1531': {
      channelId: 1,
      isPublic: false,
      usersOnline: 4,
      }
    },
  users: {}
  }
  
  console.log(dataPull);
  expect(dataPull).toStrictEqual(dataTrue);
  
  //test if clearV1 works
  clearV1();
  const dataNew = getData();
  dataTrue = { users: {}, channels: {} }
  expect(dataNew).toStrictEqual(dataTrue);
});
// test('Test invalid echo', () => {
//   expect(echo({ echo: 'echo' })).toStrictEqual({ error: 'error' });
// });
