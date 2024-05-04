import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getStamps = async () => {
  try {
    const response = await axios.get(`${API_URL}/stamps`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stamps:', error);
    throw error;
  }
};

export default {
  getStamps,
};
