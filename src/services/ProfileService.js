import { axiosClient } from '../utils/axiosClient';
const ProfileServices = {
    getProfileByUserId: async (userId) => {
        if (!userId) return;
        const result = await axiosClient.get(`/profile/${userId}`);
        return result.data;
    },
    getPostByUserId: async (userId) => {
        if (!userId) return;
        const result = await axiosClient.get(`/post/user/${userId}`);
        return result.data;
    },
    updateProfile: async (data) => {
        if (!data) return;
        const result = await axiosClient.put(`/edit-profile`, data);
        return result.data;
    },
    changePassword: async (data) => {
        if (!data) return;
        const result = await axiosClient.put(`/change-password`, data);
        return result.data;
    },
};

export default ProfileServices;
