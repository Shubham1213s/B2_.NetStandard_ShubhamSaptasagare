
// authService.js - Manages user authentication and session state
// SECURITY: Token stored in-memory (JavaScript variable), NOT in localStorage
// localStorage is vulnerable to XSS attacks. In-memory tokens require re-login on page refresh.

if (typeof module !== "undefined" && module.exports) {
    var storageService = require("./storageService");
}

var authService = {

    // In-memory token storage (secure - XSS resistant)
    _token: null,
    _currentUser: null,
    _currentRole: null,
    _isAuthenticated: false,

    /**
     * Authenticates a user and stores token/role in memory.
     * @param {string} username
     * @param {string} password
     */
    login: async function(username, password) {
        try {
            const response = await storageService.login({ username, password });

            if (response.ok) {
                const data = await response.json();
                // Store token and role IN-MEMORY (secure)
                this._token = data.token;
                this._currentUser = data.username;
                this._currentRole = data.role;
                this._isAuthenticated = true;
                return { success: true, data };
            } else if (response.status === 401) {
                return { success: false, error: 'Invalid username or password' };
            }
            return { success: false, error: 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Registers a new user and stores token/role in memory.
     * @param {string} username
     * @param {string} password
     */
    signup: async function(username, password) {
        try {
            const response = await storageService.signup({ username, password });

            if (response.ok) {
                const data = await response.json();
                // Store token and role IN-MEMORY (secure)
                this._token = data.token;
                this._currentUser = data.username;
                this._currentRole = data.role;
                this._isAuthenticated = true;
                return { success: true, data };
            } else if (response.status === 409) {
                return { success: false, error: 'Username already exists' };
            }
            return { success: false, error: 'Signup failed' };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Clears in-memory session.
     */
    logout: function() {
        // Clear in-memory storage
        this._token = null;
        this._currentUser = null;
        this._currentRole = null;
        this._isAuthenticated = false;
    },

    /**
     * @returns {boolean}
     */
    isLoggedIn: function() {
        return !!this._token;
    },

    /**
     * @returns {string|null}
     */
    getCurrentUser: function() {
        return this._currentUser;
    },

    /**
     * @returns {string|null}
     */
    getCurrentRole: function() {
        return this._currentRole;
    },

    /**
     * @returns {boolean}
     */
    isAdmin: function() {
        return this._currentRole === 'Admin';
    },

    /**
     * @returns {string|null}
     */
    getToken: function() {
        return this._token;
    }

};

// For Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = authService;
}

// For browser
if (typeof window !== "undefined") {
    window.authService = authService;
}