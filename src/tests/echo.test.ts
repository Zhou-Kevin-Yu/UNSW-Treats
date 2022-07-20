import request from 'sync-request';
import config from '../config.json';

import os from 'os';

const OK = 200;
const port = config.port;
let url = config.url;

console.log(os.platform());

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

console.log(url);

/*
Iteration 2
*/
// comment me out after u setup express
describe('HTTP tests using Jest', () => {
  test('Test successful echo', () => {
    const res = request(
      'GET',
            `${url}:${port}/echo`,
            {
              qs: {
                echo: 'Hello',
              }
            }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual('Hello');
  });
  test('Test invalid echo', () => {
    const res = request(
      'GET',
            `${url}:${port}/echo`,
            {
              qs: {
                echo: 'echo',
              }
            }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({ error: 'error' });
  });
});

test('Test successful echo', () => {
  expect(1).toBe(1);
});