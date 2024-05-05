import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getStamps = async () => {
  try {
    const response = await axios.get(`${API_URL}/stamps`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stamps:', error);
    throw error;
  }
};

export const collectStamp = async (uuid) => {
  try {
    const response = await axios.get(`${API_URL}/collect/${uuid}`);
    if (response.status === 200) {
      return response.data; // Assuming the API returns the stamp data directly
    } else {
      throw new Error('Failed to collect stamp');
    }
  } catch (error) {
    console.error(`Error collecting stamp with UUID ${uuid}:`, error);
    throw error;
  }
};
