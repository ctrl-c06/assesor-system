import axios from 'axios';
import { DATA_BASE_URL } from '@/services/config';

export const createRecord = async (data) => {
  try {
    const response = await axios.post(`${DATA_BASE_URL}/tax-declaration`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};