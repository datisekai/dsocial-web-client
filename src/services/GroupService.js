import { axiosClient } from '../utils/axiosClient';
const GroupServices = {
    getAllGroups: async () => {
        const result = await axiosClient.get('/group');
        return result.data;
    },
    getAllGroupsJoined: async () => {
        const result = await axiosClient.get(`/group/joined`);
        return result.data;
    },
    getAllGroupsOwn: async () => {
        const result = await axiosClient.get(`/group/own`);
        return result.data;
    },
    joinGroup: async (data) => {
        if (!data) return;
        const result = await axiosClient.post(`/group-user`, data);
        return result.data;
    },
    getDetailGroup: async (groupId) => {
        if (!groupId) return;
        const result = await axiosClient.get(`/group/detail/${groupId}`);
        return result.data;
    },

    kickUser: async (data) => {
        if (!data) return;
        const result = await axiosClient.delete(`/group-user/kick`, { data });
        return result.data;
    },
    outGroup: async (data) => {
        if (!data) return;
        const result = await axiosClient.delete(`/group-user`, { data });
        return result.data;
    },
    deleteGroup: async (groupId) => {
        if (!groupId) return;
        const result = await axiosClient.delete(`/group/${groupId}`);
        return result.data;
    },
};

export default GroupServices;
