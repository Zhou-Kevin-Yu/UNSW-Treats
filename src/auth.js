import { getData, setData } from './dataStore.js';

function authLoginV1(email, password) {
    let data = getData();
    for (const user of data.users) {
        if (user.email === email && user.password === password) {
            return user.uId;
        }
    }
    return { error: 'error' };
}

// Stub for a function 'authRegisterV1', with arguements named 'email', 'password', 'nameFirst' and 'nameLast'
// Returns a string concatenating the name of 'email', 'password', 'nameFirst' and 'nameLast'
function authRegisterV1(email, password, nameFirst, nameLast) {
    return 'email' +  'password' +  'nameFirst' + 'nameLast';
}

export { authLoginV1, authRegisterV1 };