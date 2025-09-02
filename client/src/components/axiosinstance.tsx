import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3000/visionaize/api/v1',
  // baseURL: 'http://20.193.251.75:3000/visionaize/api/v1',
  // baseURL: 'https://api.visionaizecondenser.com/visionaize/api/v1',
  baseURL: 'https://api.visionaizesignalminer.com/visionaize/api/v1',
  withCredentials: true,
});
const axiosInstance1 = axios.create({
  // baseURL: 'http://localhost:5000',
  // baseURL: 'http://20.3.253.237:5001',
  baseURL: 'https://python.visionaizesignalminer.com',
  // baseURL: 'https://api.visionaizesignalminer.com/visionaize/api/v1',
  withCredentials: true,
});

// Add a request interceptor to modify headers for FormData requests
axiosInstance.interceptors.request.use(config => {
  // Check if the data is an instance of FormData
  if (config.data instanceof FormData) {
    delete (config.headers ?? {})['Content-Type'];  // Remove the Content-Type header
  }
  return config;
});

axiosInstance1.interceptors.request.use(config => {
  // Check if the data is an instance of FormData
  
  return config;
});

export { axiosInstance, axiosInstance1 };
