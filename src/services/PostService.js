import { axiosClient } from '../utils/axiosClient';
const PostServices = {
    getAllPost: async ({ pageParam }) => {
        const result = await axiosClient.get(`/post?page=${pageParam}`);
        return result.data;
    },
    getPostByUserId: async ({ pageParam, id }) => {
        if (!id) return;
        const result = await axiosClient.get(`/post/user/${id}?page=${pageParam}`);
        return result.data;
    },
    getPostDetailGroup: async ({ pageParam, id }) => {
        if (!id) return;
        const result = await axiosClient.get(`/post/group/${id}?page=${pageParam}`);
        return result.data;
    },
    createComment: async (data) => {
        if (!data) return;
        const result = await axiosClient.post(`/post-comment`, data);
        return result.data;
    },
    deleteComment: async (id) => {
        if (!id) return;
        const result = await axiosClient.delete(`/post-comment/${id}`);
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
    deletePost: async (postId) => {
        if (!postId) return;
        const result = await axiosClient.delete(`/post/${postId}`);
        return result.data;
    },
    deletePostGroup: async (postId) => {
        if (!postId) return;
        const result = await axiosClient.delete(`/post/own/${postId}`);
        return result.data;
    },
};

export default PostServices;
