import axios from 'axios';
import { toast } from 'react-toastify';
import { loadApiAccessToken } from '../localstorage';

import { 
    API_DEV_BASE_URL,
    API_PRODUCTION_BASE_URL,
    DEV_SERVER_BASE_URL,
    PRODUCTION_SERVER_BASE_URL
} from '../constants';

axios.defaults.baseURL = process.env.NODE_ENV === 'production'
                         ? API_PRODUCTION_BASE_URL
                         : API_DEV_BASE_URL

axios.interceptors.request.use((config) => {
    if (!config.url.includes('token')
             && !config.url.includes('signup')
             && !config.url.includes('shared')) {
        const accessToken = loadApiAccessToken();
        config.headers['Authorization'] = `JWT ${accessToken}`;
    }

    return config;

    }, (error) => {
        return Promise.reject(error);
    });

// the first argument refers to the request
// and we don't want to intercept the request for now
axios.interceptors.response.use(null, (error) => {    
    const { config } = error.response;

    // unauthorized
    if (error.response.status === 401 && !config.url.includes('token')) {
        window.location = "/login";
    } 

    const expectedError = 
    error.response &&
    error.response.status >= 400
    && error.response.status < 500;
    
    if (!expectedError) {
        // TODO: maybe you should shown the error message instead of hardcode it
        toast.error('An unexpected error occurred');
    }

    // this will return control to the caller
    return Promise.reject(error);
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    patch: axios.patch,
    delete: axios.delete
}