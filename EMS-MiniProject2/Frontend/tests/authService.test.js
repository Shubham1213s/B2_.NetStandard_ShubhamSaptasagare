const authService = require("../js/authService");
const storageService = require("../js/storageService");

describe("Auth Service", () => {
    beforeEach(() => {
        storageService.login = jest.fn();
        storageService.signup = jest.fn();
        authService.logout();
    });

    test("should login successfully and store token in memory", async () => {
        storageService.login.mockResolvedValue({
            ok: true,
            json: async () => ({ token: "jwt-token", username: "admin", role: "Admin" })
        });

        const result = await authService.login("admin", "admin123");

        expect(result.success).toBe(true);
        expect(authService.getToken()).toBe("jwt-token");
        expect(authService.getCurrentUser()).toBe("admin");
        expect(authService.getCurrentRole()).toBe("Admin");
        expect(authService.isLoggedIn()).toBe(true);
        expect(authService.isAdmin()).toBe(true);
    });

    test("should fail login on 401", async () => {
        storageService.login.mockResolvedValue({ ok: false, status: 401 });

        const result = await authService.login("admin", "wrongpass");

        expect(result.success).toBe(false);
        expect(result.error).toBe("Invalid username or password");
    });

    test("should return duplicate username message on signup 409", async () => {
        storageService.signup.mockResolvedValue({ ok: false, status: 409 });

        const result = await authService.signup("existing", "password123");

        expect(result.success).toBe(false);
        expect(result.error).toBe("Username already exists");
    });

    test("should clear session on logout", async () => {
        storageService.login.mockResolvedValue({
            ok: true,
            json: async () => ({ token: "jwt-token", username: "admin", role: "Admin" })
        });

        await authService.login("admin", "admin123");
        authService.logout();

        expect(authService.isLoggedIn()).toBe(false);
        expect(authService.getCurrentUser()).toBeNull();
        expect(authService.getCurrentRole()).toBeNull();
        expect(authService.getToken()).toBeNull();
    });
});
