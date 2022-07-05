import { Data, getData, setData } from './dataStore';
import isEmail from "validator/lib/isEmail";


/**
 * Given a registered user's email and password, 
 * returns their `authUserId` value.
 * 
 * @param {string} email - email address to login with
 * @param {string} password - password to login with
 * @return {authUserId: number} - object with key authUserId of the valid user
 * @returns { error : 'error' } - when email is not registered
 *                             - when password is incorrect
*/
function authLoginV1(email: string, password: string) {
    let data = getData();
    for (const user of data.users) {
        if (user.email === email && user.password === password) {
            return {
                authUserId: user.uId,
            };
        }
    }
    return { error: 'error' };
}

/**
 * registers a unique user into the system with a unique handle. The first
 * user in the system is granted as a global user with permission = 1. all
 * subsequent users are granted with permission = 2.
 *
 * @param {number} email - email address to be validated using validator
 * @param {number} password - password (valid if length >= 6)
 * @param {number} nameFirst  - first name
 * @param {number} nameLast  - second name
 * @return {authUserId: number} - object with key authUserId.
 * @returns { error : 'error' } - when email has already been registered
 *                              - when password < 6 in length
 *                              - when nameFirst or nameLast > 50 or < 1
 * 
 */ 
function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string) {
    const data = getData();
    const errorReturn = { error: 'error' };
    if (!isEmail(email)) {
        return errorReturn;
    }
    for (const user of data.users) {
        if (user.email === email) {
            return errorReturn;
        }
    }
    if (password.length < 6) {
        return errorReturn;
    }
    if (nameFirst.length > 50 || nameFirst.length < 1) {
        return errorReturn;
    }
    if (nameLast.length > 50 || nameLast.length < 1) {
        return errorReturn;
    }
    //all data should be valid at this point

    //create handle
    const handle = handleCreate(data, nameFirst, nameLast);
    const authUserId = data.users.length;

    //determine permission
    let perm = 0;
    if (data.users.length === 0) {
        perm = 1
    } else {
        perm = 2;
    }

    //create new object in users array and populate fields
    data.users[authUserId] = {
        uId: authUserId,
        nameFirst: nameFirst,
        nameLast: nameLast,
        email: email,
        handleStr: handle,
        password: password,
        permission: perm,
    }
    setData(data);
    return { authUserId };
}

/**
 * helper function for authRegister.
 * takes in first and last name and returns handleString
 *
 * @param {Object} data - datastore object containing all information about channels and users
 * @param {string} nameFirst - first name
 * @param {string} nameLast  - last name
 * @return {string} - concatenated string to be handleStr
 *
 */ 
function handleCreate(data: Data, nameFirst: string, nameLast: string) {
    nameFirst = nameFirst.toLowerCase();
    nameLast = nameLast.toLowerCase();
    nameFirst = nameFirst.replace(/[^a-z0-9]/gi,'');
    nameLast = nameLast.replace(/[^a-z0-9]/gi,'');
    let handle = nameFirst.concat('', nameLast);
    //ensure handle is 20 characters or less
    if (handle.length > 20) {
        handle = handle.slice(0, 20);
    }
    let taken = true;
    let count = 0;
    while (taken) {
    taken = false;
        for (const user of data.users) {
            if (user.handleStr === handle) {
                //when count > 0 string already has a number on the end
                if (count !== 0) {
                    handle = handle.slice(0, -1);
                }  
                handle = handle.concat('', count.toString());
                count ++;
                taken = true;
            }
        }
    }
    return handle;
}

export { authLoginV1, authRegisterV1 };

