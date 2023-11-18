import React, { useEffect, useState } from 'react';
import useQueryParams from '../hooks/useQueryParams';
import { Link } from 'react-router-dom';
import { kFormatter } from '../utils/common';
import CardGroup from '../components/Card/CardGroup';
import { useQuery } from '@tanstack/react-query';
import GroupServices from '../services/GroupService';
import { useSelector } from 'react-redux';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import InfiniteScroll from 'react-infinite-scroll-component';
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
    const action = query.get('action') || '';
    const [text, setText] = React.useState('');

    const {
        data: dataAllGroups,
        isFetchingNextPage: isLoadingAllGroups,
        hasNextPage: hasNextpageAllGroups,
        fetchNextPage: fetchNextPageAllGroups,
    } = useInfiniteLoad(GroupServices.getAllGroups, 'allGroup');

    const {
        data: dataJoinGroups,
        isFetchingNextPage: isLoadingJoinGroups,
        hasNextPage: hasNextpageJoinGroups,
        fetchNextPage: fetchNextPageJoinGroups,
    } = useInfiniteLoad(GroupServices.getAllGroupsJoined, 'joinGroup');

    const {
        data: dataOwnGroups,
        isFetchingNextPage: isLoadingOwnGroups,
        hasNextPage: hasNextpageOwnGroups,
        fetchNextPage: fetchNextPageOwnGroups,
    } = useInfiniteLoad(GroupServices.getAllGroupsOwn, 'ownGroup');

    return (
        <div className="px-4 py-2">
            <div className="flex items-center justify-between">
                <h1 className="text-primary font-bold">Nhóm</h1>
                <Link to={'/group/create'}>
                    <button className="btn btn-primary btn-sm md:btn-md">Tạo nhóm</button>
                </Link>
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

            {action == 'all' && (
                <InfiniteScroll
                    dataLength={dataAllGroups.length}
                    next={fetchNextPageAllGroups}
                    hasMore={hasNextpageAllGroups}
                    className="mt-8 space-y-2"
                    loader={
                        <div className="my-2 flex justify-center">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    }
                >
                    {dataAllGroups.length === 0 ? (
                        <div>Không có nhóm nào để hiển thị</div>
                    ) : (
                        dataAllGroups.map((group, index) => (
                            <CardGroup
                                key={index}
                                group={group}
                                isJoin={group.is_joined}
                                nameQuery={['allGroup', undefined]}
                            />
                        ))
                    )}
                </InfiniteScroll>
            )}

            {action == '' && (
                <InfiniteScroll
                    dataLength={dataJoinGroups.length}
                    next={fetchNextPageJoinGroups}
                    hasMore={hasNextpageJoinGroups}
                    className="mt-8 space-y-2"
                    loader={
                        <div className="my-2 flex justify-center">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    }
                >
                    {dataJoinGroups.length === 0 ? (
                        <div>Không có nhóm nào để hiển thị</div>
                    ) : (
                        dataJoinGroups.map((group, index) => (
                            <CardGroup
                                key={index}
                                group={group}
                                isJoin={group.is_joined}
                                nameQuery={['joinGroup', undefined]}
                            />
                        ))
                    )}
                </InfiniteScroll>
            )}

            {action == 'my-group' && (
                <InfiniteScroll
                    dataLength={dataOwnGroups.length}
                    next={fetchNextPageOwnGroups}
                    hasMore={hasNextpageOwnGroups}
                    className="mt-8 space-y-2"
                    loader={
                        <div className="my-2 flex justify-center">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    }
                >
                    {dataOwnGroups.length === 0 ? (
                        <div>Không có nhóm nào để hiển thị</div>
                    ) : (
                        dataOwnGroups.map((group, index) => (
                            <CardGroup
                                key={index}
                                group={group}
                                isJoin={group.is_joined}
                                nameQuery={['ownGroup', undefined]}
                            />
                        ))
                    )}
                </InfiniteScroll>
            )}
        </div>
    );
};

export default Group;
