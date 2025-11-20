import { useQuery, useMutation } from '@tanstack/react-query';
import { APIRequest } from '../APIRequest';

// Default query options
const defaultQueryOptions = {
    retry: 1,
    refetchOnWindowFocus: false, // Do not refetch when window regains focus
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache the data for 10 minutes
};

const useFetch = (key, endpoint, params = {}, options = {}, isChange) => {
    return useQuery({
        queryKey: [key, params],
        queryFn: () => APIRequest.get(endpoint, params, isChange),
        ...defaultQueryOptions,
        ...options,
    });
};

const usePost = (endpoint,options = {},params, isChange) => {
    return useMutation({
        mutationFn: (data) => APIRequest.post(endpoint, data,params, isChange),
        ...options,
    });
};

const usePut = (endpoint, options = {}) => {
    return useMutation({
        mutationFn: (data) => APIRequest.put(endpoint, data),
        ...options,
    });
};

const usePatch = (endpoint, options = {}) => {
    return useMutation({
        mutationFn: (data) => APIRequest.patch(endpoint, data),
        ...options,
    });
};

const useDelete = (endpoint, options = {}) => {
    return useMutation({
        mutationFn: (data) => APIRequest.remove(`${endpoint}/${typeof (data) !== "object" ? data : ""}`, {}, typeof (data) === "object" ? data : {}),
        ...options,
    });
};

export { useFetch, usePost, usePut, usePatch, useDelete };
