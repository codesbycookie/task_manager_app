import axios from 'axios';

// Generic GET request
const getRequest = async (url, params = {}, headers = {}) => {
  try {
    const response = await axios.get(url, {
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('GET Request Error:', error);
    throw error;
  }
};

// Generic POST request
const postRequest = async (url, data = {}, headers = {}) => {
  try {
    const response = await axios.post(url, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('POST Request Error:', error);
    throw error;
  }
};

// PUT request
const putRequest = async (url, data = {}, headers = {}) => {
  try {
    const response = await axios.put(url, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('PUT Request Error:', error);
    throw error;
  }
};

// DELETE request
const deleteRequest = async (url, params = {}, headers = {}) => {
  try {
    const response = await axios.delete(url, {
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('DELETE Request Error:', error);
    throw error;
  }
};

export { getRequest, postRequest, putRequest, deleteRequest };
