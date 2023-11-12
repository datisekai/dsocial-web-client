import { axiosClient } from '../utils/axiosClient';
const GroupServices = {
    getAllGroups: async ({ pageParam }) => {
        const result = await axiosClient.get(`/group?page=${pageParam}`);
        return result.data;
    },
    getAllGroupsJoined: async ({ pageParam }) => {
        const result = await axiosClient.get(`/group/joined?page=${pageParam}`);
        return result.data;
    },
    getAllGroupsOwn: async ({ pageParam }) => {
        const result = await axiosClient.get(`/group/own?page=${pageParam}`);
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
