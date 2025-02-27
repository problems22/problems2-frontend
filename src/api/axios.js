import axios, { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // This ensures that cookies are sent with requests
  withCredentials: true,
});

// This interceptor handles all responses from API requests made through this axios instance
axiosInstance.interceptors.response.use(
  // First callback handles successful responses - just passes them through
  (response) => response,
  
  // Second callback handles errors
  async (error) => {
    // Store the original failed request so we can retry it later
    const originalRequest = error.config;
    
    // Check if the error is due to an unauthorized status (401)
    // AND this request hasn't already been retried (to prevent infinite loops)
    if (error.response?.status === HttpStatusCode.Unauthorized && error.response?.error === 'InvalidAccessTokenException' && !originalRequest._retry) {
      // Mark this request as retried so we don't try again if it fails
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the access token
        // This typically calls an endpoint that uses a refresh token to get a new access token
        await axiosInstance.post('/users/user/refresh-token');
        
        // If refresh succeeded, retry the original failed request
        // The new access token will be automatically included by axios
        return axiosInstance(originalRequest);
      } catch (refreshError) {
          if (refreshError.response?.error === 'InvalidRefreshTokenException') {
            // If refresh token request also fails, user needs to login again
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
      }
    }

    // Check if the error is due to an TOO_MANY_REQUESTS status (429)
    if (error.response?.status === HttpStatusCode.TooManyRequests) {
      toast.error(error.response?.data);
      return Promise.reject(error);
    }

    // Check if the error is due to a NOT_FOUND status (404) and error message 'QuizNotFoundException'
    if (error.response?.status === HttpStatusCode.NotFound && error.response?.error === 'QuizNotFoundException') {
      toast.error('Quiz not found');
      return Promise.reject(error);
    }

    // Add these cases in the error interceptor before the final return
    if (error.response?.status === HttpStatusCode.BadRequest && error.response?.error === 'InvalidQuizStateException') {
      toast.error('Invalid quiz state. The quiz may have already been completed or stopped.');
      return Promise.reject(error);
    }

    if (error.response?.status === HttpStatusCode.BadRequest && error.response?.error === 'InvalidAnswerFormatException') {
      toast.error('Invalid answer format. Please check your answers and try again.');
      return Promise.reject(error);
    }

    // If error wasn't unauthorized or retry already attempted,
    // reject the promise with the original error
    return Promise.reject(error);
  }
);

export default axiosInstance; 