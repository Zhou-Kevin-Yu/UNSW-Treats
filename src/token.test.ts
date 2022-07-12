import { tokenToAuthUserId } from "./token";

describe("tests basic string converstion and stripping", () => {
    test("test invalidToken", () => {
        expect(tokenToAuthUserId("randomString", false)).toBe(null);
    });

    test("test validToken", () => {
        const token = String(Math.random() + 1);
        expect(tokenToAuthUserId(token, true)).toBe(1);
    });

    test('test validToken with a larger number as authUserId', () => {
        const token = String(Math.random() + 20);
        expect(tokenToAuthUserId(token, true)).toBe(20);
    });

});