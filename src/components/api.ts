// api.ts
import axios from 'axios';

const baseUrl = 'http://62.90.222.249:10001/api/admin/';

export const loginApi = async () => {
  try {
    const response = await axios.post(`${baseUrl}login`, {
      username: 'test',
      password: 'test123',
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getMoviesApi = async (token: string) => {
  try {
    const response = await axios.get(`${baseUrl}GetMovies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};