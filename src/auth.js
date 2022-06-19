import { getData, setData } from './dataStore';
import isEmail from "validator/lib/isEmail"

function authLoginV1(email, password) {
        return 'email' + 'password';
}

function handleCreate(data, nameFirst, nameLast) {
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

function authRegisterV1(email, password, nameFirst, nameLast) {
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

    //create new object in users array and populate fields
    data.users[authUserId] = {
        uId: authUserId,
        nameFirst: nameFirst,
        nameLast: nameLast,
        email: email,
        handleStr: handle,
        password: password,
    }
    setData(data);
    return { authUserId };
}


export { authLoginV1, authRegisterV1 };

