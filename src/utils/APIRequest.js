import { api_enums } from "./enums/api";


export const BASE_URL = process.env.NEXT_API_BASE_URL;
export const BASE_URL2 = process.env.NEXT_API_BASE_URL2;



const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw error.message || 'Something went wrong';
    }
    return response.json();
};

const getBody = (data) => (data instanceof FormData) ? data : JSON.stringify(data);

export const getAccessToken = () => {
    return localStorage.getItem(api_enums.JWT_ACCESS_TOKEN) ? localStorage.getItem(api_enums.JWT_ACCESS_TOKEN) : window.localStorage.getItem(api_enums.JWT_ONBOARDING_ACCESS_TOKEN);
};

const getHeaders = (body = {}) => {
    return {
        ...(getAccessToken() && { Authorization: `Bearer ${getAccessToken()}` }),
        ...(!(body instanceof FormData) && { 'Content-Type': 'application/json' }),
    };
};

const buildQueryString = (params) => {
    return Object.keys(params)
        .map((key) => {
            const value = encodeURIComponent(params[key]).replace(/%2C/g, ',');
            return `${encodeURIComponent(key)}=${value}`;
        })
        .join('&');
};

export const APIRequest = {
    get: async (endpoint, params = {}, isChange) => {
        const queryString = buildQueryString(params);
        const response = await fetch(`${isChange  ? BASE_URL2  : BASE_URL}/${endpoint}?${queryString}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
    post: async (endpoint, data, params = {}, isChange) => {
        const queryString = buildQueryString(params);
        const response = await fetch(`${isChange ? BASE_URL2 :BASE_URL}/${endpoint}?${queryString}`, {
            method: 'POST',
            headers: getHeaders(data),
            body: getBody(data),
        });
        return handleResponse(response);
    },
    put: async (endpoint, data, params = {}) => {
        const queryString = buildQueryString(params);
        const response = await fetch(`${BASE_URL}/${endpoint}?${queryString}`, {
            method: 'PUT',
            headers: getHeaders(data),
            body: getBody(data),
        });
        return handleResponse(response);
    },
    patch: async (endpoint, data, params = {}) => {
        const queryString = buildQueryString(params);
        const response = await fetch(`${BASE_URL}/${endpoint}?${queryString}`, {
            method: 'PATCH',
            headers: getHeaders(data),
            body: getBody(data),
        });
        return handleResponse(response);
    },
    remove: async (endpoint, params = {}, data = {}) => {
        const queryString = buildQueryString(params);
        const response = await fetch(`${BASE_URL}/${endpoint}?${queryString}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: getBody(data),
        });
        return handleResponse(response);
    },
};
