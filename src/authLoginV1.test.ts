import { authLoginV1, authRegisterV1 } from './auth';
import { clearV1 } from './other';

// TODO: Add ClearV1 to tests

beforeEach(() => {
  clearV1();
});

test('Test successful authLoginV1', () => {
  const registeredId = authRegisterV1('test@gmail.com', 'password', 'first', 'last').authUserId;
  const loggedId = authLoginV1('test@gmail.com', 'password').authUserId;
  expect(loggedId).toStrictEqual(registeredId);
});

test('Test wrong password authLoginV1', () => {
  authRegisterV1('test@gmail.com', 'password', 'first', 'last');
  const loggedId = authLoginV1('test@gmail.com', 'wrong');
  expect(loggedId).toMatchObject({ error: 'error' });
});

test('Test wrong email authLoginV1', () => {
  authRegisterV1('test@gmail.com', 'password', 'first', 'last');
  const loggedId = authLoginV1('wrong@gmail.com', 'password');
  expect(loggedId).toMatchObject({ error: 'error' });
});

test('Test no registration before authLoginV1', () => {
  const loggedId = authLoginV1('test@gmail.com', 'password');
  expect(loggedId).toMatchObject({ error: 'error' });
});
