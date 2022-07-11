import request from 'sync-request';
import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;

// Comment me out when we get servers working
test('just an echo test', () => {
  expect(true).toBe(true);
});


/*
Iteration 2
*/
// Going to comment these out now since we
// don't have our server working just yet
/*
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
*/
