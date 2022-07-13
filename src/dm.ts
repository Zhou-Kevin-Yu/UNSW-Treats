import { getData, setData } from './dataStore';
import { DmCreateV1, DmListV1, DmRemoveV1, DmDetailsV1, DmLeaveV1 } from './dataStore';
import { generateToken, tokenToAuthUserId, isTokenValid } from './token';

export function dmCreateV1(token: string, uIds: number[]): DmCreateV1 {
    return {}
}

export function dmListV1(token: string): DmListV1 {
    return {}
}

export function dmRemoveV1(token: string, dmId: number): DmRemoveV1 {
    return {}
}

export function dmDetailsV1(token: string, dmId: number): DmDetailsV1 {
    return {}
}

export function dmLeaveV1(token: string, dmId: number): DmLeaveV1 {
    return {}
}