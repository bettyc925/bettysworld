export const API_BASE_URL = 'http://localhost:8000/api';

export const endpoints = {
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        me: `${API_BASE_URL}/auth/me`,
    },
    users: {
        profile: `${API_BASE_URL}/users/profile`,
    },
};
