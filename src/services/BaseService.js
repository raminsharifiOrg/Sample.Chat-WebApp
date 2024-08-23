import axios from 'axios';

class BaseService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: "https://localhost:44361/",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add a request interceptor to include the token if it exists
        this.apiClient.interceptors.request.use((config) => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                config.headers.Authorization = `${user}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
    }

    // Add other common methods, like handling errors, if needed
}

export default BaseService;
