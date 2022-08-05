import { clearV1 } from '../other';
import { getData, setData } from '../dataStore';
import { Data } from '../dataStore';
import config from '../config.json';

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';


test('Test successful user clear', () => {
  clearV1();
  const data = getData();
  data.users[0] = {
    uId: 0,
    nameFirst: 'Gary',
    nameLast: 'Sun',
    email: 'gary.sun@student.unsw.edu.au',
    handleStr: 'Gazza',
    password: 'bird27',
    permission: 1,
    tokens: ['token'],
    resetCodes: ['code'],
    profileImgUrl: `src/photos/default.jpg`

  };
  // const dataInit = data;
  setData(data);

  // //test here to see if data is correctly set
  // const dataPull = getData();
  // let dataTrue =
  // {users: {
  //   'test@dream.com': {
  //     userId: 1,
  //     password: 'password',
  //     name: 'master tetik'
  //     }
  //   },
  // channels: {}
  // }

  // console.log(dataPull);
  // expect(dataPull).toStrictEqual(dataTrue);

  // test if clearV1 works
  clearV1();
  const dataNew = getData();
  const dataTrue: Data = { users: [], channels: [], dms: [], systemInfo: { messageTotal: 0 } };
  expect(dataNew).toStrictEqual(dataTrue);
});

// test('Test successful channel clear', () => {
//   clearV1();
//   const data = getData();
//   console.log(data)
//   data.channels['COMP1531'] = {
//     channelId: 1,
//     isPublic: false,
//     usersOnline: 4,
//   };
//   const dataInit = data;
//   setData(data);

//   // //test here to see if data is correctly set
//   const dataPull = getData();
//   let dataTrue =
//   {channels: {
//     'COMP1531': {
//       channelId: 1,
//       isPublic: false,
//       usersOnline: 4,
//       }
//     },
//   users: {}
//   }

//   console.log(dataPull);
//   expect(dataPull).toStrictEqual(dataTrue);

//   //test if clearV1 works
//   clearV1();
//   const dataNew = getData();
//   dataTrue = { users: {}, channels: {} }
//   expect(dataNew).toStrictEqual(dataTrue);
// });

// test('Test invalid echo', () => {
//   expect(echo({ echo: 'echo' })).toStrictEqual({ error: 'error' });
// });
