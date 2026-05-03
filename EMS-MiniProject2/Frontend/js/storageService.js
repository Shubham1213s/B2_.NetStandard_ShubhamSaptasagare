// storageService.js - Centralized API boundary for all backend calls

var storageService = {

    /**
     * Builds request headers and attaches JWT when needed.
     * @returns {{'Content-Type': string, 'Authorization'?: string}}
     */
    _getAuthHeader: function() {
        const token = authService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    },

    /**
     * Builds request headers without Authorization (for auth endpoints).
     * @returns {{'Content-Type': string}}
     */
    _getBasicHeader: function() {
        return {
            'Content-Type': 'application/json'
        };
    },

    /**
     * Sends login request.
     * @param {{username: string, password: string}} payload
     * @returns {Promise<Response>}
     */
    login: async function(payload) {
        return await fetch(`${CONFIG.API_BASE_URL}/Auth/login`, {
            method: 'POST',
            headers: this._getBasicHeader(),
            body: JSON.stringify(payload)
        });
    },

    /**
     * Sends signup/register request.
     * @param {{username: string, password: string}} payload
     * @returns {Promise<Response>}
     */
    signup: async function(payload) {
        return await fetch(`${CONFIG.API_BASE_URL}/Auth/register`, {
            method: 'POST',
            headers: this._getBasicHeader(),
            body: JSON.stringify(payload)
        });
    },

    /**
     * Gets dashboard summary payload.
     * @returns {Promise<Response>}
     */
    getDashboardSummary: async function() {
        return await fetch(`${CONFIG.API_BASE_URL}/employees/dashboard`, {
            method: 'GET',
            headers: this._getAuthHeader()
        });
    },

    /**
     * Gets paged employees with search/filter/sort.
     */
    getAll: async function(page = 1, pageSize = 10, search = '', department = '', status = '', sortBy = 'name', sortDir = 'asc') {
        try {
            const params = new URLSearchParams({
                page,
                pageSize,
                search,
                department,
                status,
                sortBy,
                sortDir
            });
            const response = await fetch(`${CONFIG.API_BASE_URL}/employees?${params}`, {
                method: 'GET',
                headers: this._getAuthHeader()
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch employees');
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    },

    /**
     * Gets employee by id.
     * @param {number} id
     */
    getById: async function(id) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/employees/${id}`, {
                method: 'GET',
                headers: this._getAuthHeader()
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch employee');
        } catch (error) {
            console.error('Error fetching employee:', error);
            throw error;
        }
    },

    /**
     * Creates employee.
     * @param {object} employee
     */
    add: async function(employee) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/employees`, {
                method: 'POST',
                headers: this._getAuthHeader(),
                body: JSON.stringify(employee)
            });

            if (response.ok) {
                return await response.json();
            } else if (response.status === 400 || response.status === 409) {
                const errors = await response.json();
                throw { status: response.status, errors };
            }
            throw new Error('Failed to add employee');
        } catch (error) {
            console.error('Error adding employee:', error);
            throw error;
        }
    },

    /**
     * Updates employee.
     * @param {number} id
     * @param {object} data
     */
    update: async function(id, data) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/employees/${id}`, {
                method: 'PUT',
                headers: this._getAuthHeader(),
                body: JSON.stringify(data)
            });

            if (response.ok) {
                return await response.json();
            } else if (response.status === 400 || response.status === 409) {
                const errors = await response.json();
                throw { status: response.status, errors };
            }
            throw new Error('Failed to update employee');
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    },

    /**
     * Deletes employee.
     * @param {number} id
     */
    remove: async function(id) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/employees/${id}`, {
                method: 'DELETE',
                headers: this._getAuthHeader()
            });

            if (response.ok) {
                return { success: true };
            }
            throw new Error('Failed to delete employee');
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }

};

// For Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = storageService;
}

// For browser
if (typeof window !== "undefined") {
    window.storageService = storageService;
}