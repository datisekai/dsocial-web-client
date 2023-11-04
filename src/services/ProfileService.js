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
    updateProfile: (data) => {
        if (!data) return;
        return axiosClient.put(`/edit-profile`, data);
    },
};

export default ProfileServices;
