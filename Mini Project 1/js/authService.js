
// authService.js - Manages user authentication and session state

if (typeof module !== "undefined" && module.exports) {
    var data = require("./data");
    var adminData = data.adminData;
}

var authService = {

    admin: (typeof adminData !== "undefined" ? adminData : null) || {
        username: "admin",
        password: "123456"
    },

    currentUser: null,
    isAuthenticated: false,

    login: function(username, password) {
        if (this.admin.username === username && this.admin.password === password) {
            this.isAuthenticated = true;
            this.currentUser = username;
            return true;
        }
        return false;
    },

    logout: function() {
        this.isAuthenticated = false;
        this.currentUser = null;
    },

    signup: function(username, password) {
        this.admin = { username, password };
    },

    isLoggedIn: function() {
        return this.isAuthenticated;
    },

    getCurrentUser: function() {
        return this.currentUser;
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