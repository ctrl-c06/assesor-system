import axios from 'axios';
import { DATA_BASE_URL } from './config';


export const getMunicipalities = async () => {
  const response = await axios.get(`${DATA_BASE_URL}/municipalities`);
  return response.data;
};

export const getBarangays = async () => {
  const response = await axios.get(`${DATA_BASE_URL}/barangays`);
  return response.data;
};
