
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://blog-app1-9gu6.onrender.com',  
  withCredentials: true,
});

export default axiosClient;
