import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (fullName, email) => {
    try {
        const response = await axios.post(`${API_URL}/user`, { full_name: fullName, email: email.toLowerCase() });
        return response.data;
    } catch (error) {
        console.error('Failed to register user:', error);
        throw error;
    }
};

export const loginUser = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, { email: email.toLowerCase() });
        return response.data;
    } catch (error) {
        console.error('Failed to log in user:', error);
        throw error;
    }
};
