import { axiosClient } from '../utils/axiosClient';
const PostServices = {
    getAllPost: async () => {
        const result = await axiosClient.get(`/post`);
        return result.data;
    },
    getPostByUserId: async (userId) => {
        if (!userId) return;
        const result = await axiosClient.get(`/post/user/${userId}`);
        return result.data;
    },
    getPostDetailGroup: async (groupId) => {
        if (!groupId) return;
        const result = await axiosClient.get(`/post/group/${groupId}`);
        return result.data;
    },
    addComment: async (groupId) => {
        if (!groupId) return;
        const result = await axiosClient.get(`/post/group/${groupId}`);
        return result.data;
    },
    createPost: async (data) => {
        if (!data) return;
        const result = await axiosClient.post(`/post`, data);
        return result.data;
    },
};

export default PostServices;
