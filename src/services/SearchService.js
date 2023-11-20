import { axiosClient } from '../utils/axiosClient';
const SearchServices = {
    searchPeople: async ({ pageParam, q }) => {
        const result = await axiosClient.get(`/search/user?page=${pageParam}&q=${q}`);
        return result.data;
    },
    searchGroups: async ({ pageParam, q }) => {
        const result = await axiosClient.get(`/search/group?page=${pageParam}&q=${q}`);
        return result.data;
    },
    searchPosts: async ({ pageParam, q }) => {
        const result = await axiosClient.get(`/search/post?page=${pageParam}&q=${q}`);
        return result.data;
    },
};

export default SearchServices;
