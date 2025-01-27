import axios from 'axios';
import { DATA_BASE_URL } from '@/services/config';

export const createRecord = async (data, errors) => {
  try {
    const response = await axios.post(`${DATA_BASE_URL}/tax-declaration`, data);
    return response.data;
  } catch (error) {
    errors.value = error.response.data;
    console.error(error);
  }
};