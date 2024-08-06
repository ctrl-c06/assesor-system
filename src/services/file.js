import axios from 'axios';
import { FILE_BASE_URL } from '@/services/config';
import alertify from 'alertifyjs';

export const getDirectoryFiles = async () => {
  const response = await axios.get(`${FILE_BASE_URL}/files`);
  return response.data;
};


export const downloadFile = (fileName) => {
  const url = `${FILE_BASE_URL}/download?file=${fileName}`;
  window.open(url, "_blank");
};

export const submitRenameFile = async (file) => {
    const response = await axios.post(`${FILE_BASE_URL}/rename`, {
      name: file.name + ".pdf",
      time: file.modTime,
      oldFileName: file.oldFileName,
    });
    return response.data;
};

export const deleteFile = async (file) => {
  alertify.confirm('Are you sure you want to delete this file?', async (confirm) => {
    if (confirm) {
      try {
          const response = await axios.post(`${FILE_BASE_URL}/delete`, {
            name: file.name,
            time: file.modTime,
          });
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
    } 
    }).set({
    title : 'Delete File',
  });
};




