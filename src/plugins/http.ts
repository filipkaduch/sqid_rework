import axios from 'axios'

export const http = axios.create()

http.interceptors.request.use((config) => {
    return config;
})

http.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
})

export default http;
