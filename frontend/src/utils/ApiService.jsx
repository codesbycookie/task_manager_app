import axios from 'axios';

// Generic GET request
const getRequest = async (url, params = {}, headers = {}) => {
  const response = await axios.get(url, {
    params,
    headers,
  });
  return response.data;
};

// Generic POST request
const postRequest = async (url, data = {}, headers = {}) => {
  const response = await axios.post(url, data, {
    headers,
  });
  return response.data;
};

// PUT request
const putRequest = async (url, data = {}, headers = {}) => {
  const response = await axios.put(url, data, {
    headers,
  });
  return response.data;
};

// DELETE request
const deleteRequest = async (url, params = {}, headers = {}) => {
  const response = await axios.delete(url, {
    params,
    headers,
  });
  return response.data;
};

export { getRequest, postRequest, putRequest, deleteRequest };
