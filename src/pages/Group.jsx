import React, { useEffect, useState } from 'react';
import useQueryParams from '../hooks/useQueryParams';
import { Link } from 'react-router-dom';
import { kFormatter } from '../utils/common';
import CardGroup from '../components/Card/CardGroup';
import { useQuery } from '@tanstack/react-query';
import GroupServices from '../services/GroupService';
import { useSelector } from 'react-redux';
const tabs = [
    {
        action: '',
        title: 'Nhóm đã tham gia',
    },
    {
        action: 'all',
        title: 'Tất cả nhóm',
    },
    {
        action: 'my-group',
        title: 'Nhóm của tôi',
    },
];
const Group = () => {
    const query = useQueryParams();
    const { user } = useSelector((state) => state.user);
    const action = query.get('action') || '';
    const { data: dataAllGroups, isLoading: isLoadingAllGroups } = useQuery({
        queryKey: ['allgroups'],
        queryFn: () => {
            return GroupServices.getAllGroups();
        },
    });
    console.log(dataAllGroups);
    const { data: dataAllGroupsJoined, isLoading: isLoadingAllGroupsJoined } = useQuery({
        queryKey: ['allgroupsjoined'],
        queryFn: () => {
            return GroupServices.getAllGroupsJoined();
        },
    });
    const { data: dataAllGroupsOwn, isLoading: isLoadingAllGroupsOwn } = useQuery({
        queryKey: ['allgroupsown'],
        queryFn: () => {
            return GroupServices.getAllGroupsOwn();
        },
    });
    const [groups, setGroups] = useState(null);
    useEffect(() => {
        action == ''
            ? setGroups(dataAllGroupsJoined)
            : action == 'all'
            ? setGroups(dataAllGroups)
            : setGroups(dataAllGroupsOwn);
    });
    return (
        <div className="px-4 py-2">
            <div className="flex items-center justify-between">
                <h1 className="text-primary font-bold">Nhóm</h1>
                <button className="btn btn-primary btn-sm md:btn-md">Tạo nhóm</button>
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-4">
                {tabs.map((tab, index) => (
                    <Link key={index} to={tab.action ? `/group?action=${tab.action}` : '/group'}>
                        <button className={`btn btn-sm normal-case ${tab.action == action ? 'btn-primary' : ''}`}>
                            {tab.title}
                        </button>
                    </Link>
                ))}
            </div>

            <div className="mt-4">
                <input type="text" placeholder="Tìm kiếm nhóm" className="input input-bordered w-full max-w-xs" />
            </div>

            <div className="mt-4 space-y-2">
                {!isLoadingAllGroups &&
                    !isLoadingAllGroupsJoined &&
                    !isLoadingAllGroupsOwn &&
                    groups?.data.map((group, index) => (
                        <CardGroup key={index} group={group} isJoin={group.is_joined} />
                    ))}
            </div>
        </div>
    );
};

export default Group;
