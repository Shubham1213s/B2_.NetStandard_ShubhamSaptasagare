// const authService = require("../js/authService");

// describe("Auth Service", () => {

//     test("should login with correct credentials", () => {
//         let result = authService.login("admin", "123456");
//         expect(result).toBe(true);
//     });

//     test("should fail login with wrong credentials", () => {
//         let result = authService.login("wrong", "wrong");
//         expect(result).toBe(false);
//     });

//     test("should signup new user", () => {
//         authService.signup("newuser", "123456");
//         let result = authService.login("newuser", "123456");
//         expect(result).toBe(true);
//     });

//     test("should logout user", () => {
//         authService.login("admin", "123456");

        
//         authService.logout();
      

        
//         expect(authService.isAuthenticated).toBe(false);
//     });

// });


const authService = require("../js/authService");

describe("Auth Service", () => {

    // Reset admin before each test
    beforeEach(() => {
        authService.admin = { username: "admin", password: "123456" };
        authService.isAuthenticated = false;
        authService.currentUser = null;
    });

    // --- Login Tests ---
    test("should login successfully with correct credentials", () => {
        let result = authService.login("admin", "123456");
        expect(result).toBe(true);
    });

    test("should fail login with wrong password", () => {
        let result = authService.login("admin", "wrongpass");
        expect(result).toBe(false);
    });

    test("should fail login with wrong username", () => {
        let result = authService.login("wronguser", "123456");
        expect(result).toBe(false);
    });

    test("should fail login with both fields wrong", () => {
        let result = authService.login("wrong", "wrong");
        expect(result).toBe(false);
    });

    // --- Session State Tests ---
    test("should set isAuthenticated to true after successful login", () => {
        authService.login("admin", "123456");
        expect(authService.isAuthenticated).toBe(true);
    });

    test("should set currentUser after successful login", () => {
        authService.login("admin", "123456");
        expect(authService.currentUser).toBe("admin");
    });

    test("should clear session on logout", () => {
        authService.login("admin", "123456");
        authService.logout();
        expect(authService.isAuthenticated).toBe(false);
        expect(authService.currentUser).toBeNull();
    });

    test("isLoggedIn should return true when authenticated", () => {
        authService.login("admin", "123456");
        expect(authService.isLoggedIn()).toBe(true);
    });

    test("isLoggedIn should return false after logout", () => {
        authService.login("admin", "123456");
        authService.logout();
        expect(authService.isLoggedIn()).toBe(false);
    });

    // --- Signup Tests ---
    test("should signup new user and allow login", () => {
        authService.signup("newadmin", "password123");
        let result = authService.login("newadmin", "password123");
        expect(result).toBe(true);
    });

    test("should not login with old credentials after signup", () => {
        authService.signup("newadmin", "password123");
        let result = authService.login("admin", "123456");
        expect(result).toBe(false);
    });

});


