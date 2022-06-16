import { authLoginV1, authRegisterV1 } from './auth';

// TODO: Add ClearV1 to tests

test('Test successful authLoginV1', () => {
    const registeredId = authRegisterV1('test@gmail.com', 'password', 'first', 'last');
    const loggedId = authLoginV1('test@gmail.com', 'password');
    expect(loggedId).toBe(registeredId);
});

test('Test wrong password authLoginV1', () => {
    const registeredId = authRegisterV1('test@gmail.com', 'password', 'first', 'last');
    const loggedId = authLoginV1('test@gmail.com', 'wrong');
    expect(loggedId).toMatchObject({ error: 'error' });
});

test('Test wrong email authLoginV1', () => {
    const registeredId = authRegisterV1('test@gmail.com', 'password', 'first', 'last');
    const loggedId = authLoginV1('wrong@gmail.com', 'password');
    expect(loggedId).toMatchObject({ error: 'error' });
});

test('Test no registration before authLoginV1', () => {
    const loggedId = authLoginV1('test@gmail.com', 'password');
    expect(loggedId).toMatchObject({ error: 'error' });
});