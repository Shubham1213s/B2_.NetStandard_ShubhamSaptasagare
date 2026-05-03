// Configuration for EMS Frontend
const CONFIG = {
    API_BASE_URL: 'http://localhost:5006/api',
    PAGE_SIZE: 10,
    TIMEOUT: 30000  // 30 seconds
};

// Utility function to get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}
