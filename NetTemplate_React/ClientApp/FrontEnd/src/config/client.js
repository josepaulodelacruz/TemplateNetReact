import axios from 'axios';
import useAuth from '~/hooks/Auth/useAuth';

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

client.interceptors.request.use(
  (config) => {
    const { token } = useAuth.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (config) => config,
  (error) => {
    const invalidStatus = [403, 401];
    if (
      error.response?.status &&
      invalidStatus.includes(error.response?.status)
    )
      useAuth.getState().onSetClearToken();

    return Promise.reject(error);
  }
);


export default client;


