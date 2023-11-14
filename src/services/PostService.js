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
    createComment: async (data) => {
        if (!data) return;
        const result = await axiosClient.post(`/post-comment`, data);
        return result.data;
    },
    createReaction: async (data) => {
        if (!data) return;
        const result = await axiosClient.post(`/post-reaction`, data);
        return result.data;
    },
    deleteReaction: async (id) => {
        if (!id) return;
        const result = await axiosClient.delete(`/post-reaction/${id}`);
        return result.data;
    },
    createPost: async (data) => {
        if (!data) return;
        const result = await axiosClient.post(`/post`, data);
        return result.data;
    },
    updatePost: async (data) => {
        if (!data) return;
        const result = await axiosClient.put(`/post/${data.id}`, data);
        return result.data;
    },
    deletePost: async (postId) => {
        if (!postId) return;
        const result = await axiosClient.delete(`/post/${postId}`);
        return result.data;
    },
};

export default PostServices;
