import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useQueryParams from '../hooks/useQueryParams';
import FriendServices from '../services/FriendService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import getImage from '../utils/getImage';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import InfiniteScroll from 'react-infinite-scroll-component';

const tabs = [
    {
        title: 'Bạn bè',
    },
    {
        title: 'Lời mời kết bạn',
        action: 'request',
    },
];

const Friend = () => {
    const query = useQueryParams();
    const queryClient = useQueryClient();

    const { user } = useSelector((state) => state.user);

    // const { data: dataFriend, isLoading: isLoadingFriend } = useQuery({
    //     queryKey: ['friends', user.id],
    //     queryFn: () => {
    //         return FriendServices.getFriendByUserId(user.id);
    //     },
    // });
    const {
        data: dataFriend,
        isFetchingNextPage: isLoadingFriend,
        hasNextPage: hasNextpageFriend,
        fetchNextPage: fetchNextPageFriend,
    } = useInfiniteLoad(FriendServices.getFriendByUserId, 'friends', null);

    // const { data: dataFriendRequest, isLoading: isLoadingFriendRequest } = useQuery({
    //     queryKey: ['friendRequests', user.id],
    //     queryFn: () => {
    //         return FriendServices.getFriendRequestByUserId();
    //     },
    // });

    const {
        data: dataFriendRequest,
        isFetchingNextPage: isLoadingFriendRequest,
        hasNextPage: hasNextpageFriendRequest,
        fetchNextPage: fetchNextPageFriendRequest,
    } = useInfiniteLoad(FriendServices.getFriendRequestByUserId, 'friendRequests', null);

    const { mutate: mutateAcceptFriend, isPending: isPendingAcceptF } = useMutation({
        mutationFn: FriendServices.acceptFriend,
        onSuccess: (data) => {
            const currentFriend = queryClient.getQueryData(['friends']);
            const currentFriendResq = queryClient.getQueryData(['friendRequests']);
            if (currentFriend) {
                const newDataFriend = {
                    pageParams: currentFriend.pageParams,
                    pages: [
                        {
                            success: currentFriend.pages[0].success,
                            data: [data.data, ...currentFriend.pages[0].data],
                            pagination: currentFriend.pages[0].pagination,
                        },
                    ],
                };

                queryClient.setQueryData(['friends'], newDataFriend);
                if (currentFriendResq) {
                    const newDataFriendRequest = {
                        pageParams: currentFriendResq.pageParams,
                        pages: [
                            {
                                success: currentFriendResq.pages[0].success,
                                data: currentFriendResq.pages[0].data.filter((item) => item.id !== data.data.id),
                                pagination: currentFriendResq.pages[0].pagination,
                            },
                        ],
                    };
                    queryClient.setQueryData(['friendRequests'], newDataFriendRequest);
                }
            }
            console.log(data);
            Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const { mutate: mutateDelFriendReq, isPending: isPendingDelFResq } = useMutation({
        mutationFn: FriendServices.deleteFriendRequest,
        onSuccess: (data) => {
            const currentFriendResq = queryClient.getQueryData(['friendRequests']);
            console.log(data.data, currentFriendResq);
            if (currentFriendResq) {
                const newDataFriendRequest = {
                    pageParams: currentFriendResq.pageParams,
                    pages: [
                        {
                            success: currentFriendResq.pages[0].success,
                            data: currentFriendResq.pages[0].data.filter((item) => item.id !== data.data.id),
                            pagination: currentFriendResq.pages[0].pagination,
                        },
                    ],
                };
                queryClient.setQueryData(['friendRequests'], newDataFriendRequest);
            }
            Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const { mutate: mutateDelFriend, isPending: isPendingDelF } = useMutation({
        mutationFn: FriendServices.deleteFriend,
        onSuccess: (data) => {
            const currentFriend = queryClient.getQueryData(['friends']);
            if (currentFriend) {
                const newDataFriend = {
                    pageParams: currentFriend.pageParams,
                    pages: [
                        {
                            success: currentFriend.pages[0].success,
                            data: currentFriend.pages[0].data.filter((item) => item.id !== data.data.id),
                            pagination: currentFriend.pages[0].pagination,
                        },
                    ],
                };
                queryClient.setQueryData(['friends'], newDataFriend);
            }
            Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const handleAcceptFriend = (values) => {
        mutateAcceptFriend(values.id);
    };

    const handleDelFriendReq = (values) => {
        mutateDelFriendReq(values.id);
    };

    const handleDelFriend = (values) => {
        mutateDelFriend(values.id);
    };
    return (
        <div className="flex flex-col md:flex-row  px-4 py-2">
            <ul className="w-full border-r md:w-[150px] flex flex-row md:flex-col">
                {tabs.map((tab, index) => {
                    return (
                        <Link key={index} to={`/friend${tab?.action ? '?action=' + tab.action : ''}`}>
                            <li className={`p-2`}>
                                <span
                                    className={`${query.get('action') == tab?.action ? 'border-b border-primary' : ''}`}
                                >
                                    {tab.title}
                                </span>
                            </li>
                        </Link>
                    );
                })}
            </ul>
            <div className="flex-1 md:px-4">
                {query.get('action') === 'request' ? (
                    <>
                        <h1 className="text-primary font-bold">Lời mời kết bạn</h1>
                        <InfiniteScroll
                            dataLength={dataFriendRequest.length}
                            next={fetchNextPageFriendRequest}
                            hasMore={hasNextpageFriendRequest}
                            className="mt-4 space-y-2"
                            loader={
                                <div className="my-2 flex justify-center">
                                    <span className="loading loading-dots loading-md"></span>
                                </div>
                            }
                        >
                            {dataFriendRequest.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <Link to={`/profile/${item.id}`} className="link link-hover">
                                        <div className="flex items-center gap-2">
                                            <img
                                                className="rounded-full w-[70px] h-[70px]"
                                                src={`${getImage(item.avatar)}`}
                                                alt=""
                                            />

                                            <h2 className="font-bold">{item.name}</h2>
                                        </div>
                                    </Link>
                                    <div className="flex gap-2 mt-2 md:mt-0 flex-col md:flex-row">
                                        <button
                                            disabled={isPendingAcceptF}
                                            className="btn btn-primary btn-sm md:btn-md"
                                            onClick={() => handleAcceptFriend(item)}
                                        >
                                            {isPendingAcceptF && <span className="loading loading-spinner"></span>}
                                            Chấp nhận
                                        </button>
                                        <button
                                            disabled={isPendingDelFResq}
                                            className="btn btn-sm md:btn-md"
                                            onClick={() => handleDelFriendReq(item)}
                                        >
                                            {isPendingDelFResq && <span className="loading loading-spinner"></span>}
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </InfiniteScroll>
                    </>
                ) : (
                    <>
                        <h1 className="text-primary font-bold">Bạn bè</h1>
                        <InfiniteScroll
                            dataLength={dataFriend.length}
                            next={fetchNextPageFriend}
                            hasMore={hasNextpageFriend}
                            className="mt-4 space-y-2"
                            loader={
                                <div className="my-2 flex justify-center">
                                    <span className="loading loading-dots loading-md"></span>
                                </div>
                            }
                        >
                            {dataFriend.map((item, index) => {
                                return (
                                    <div className="flex items-center justify-between " key={index}>
                                        <Link to={`/profile/${item.id}`} className="link link-hover">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    className="rounded-full w-[70px] h-[70px]"
                                                    src={`${getImage(item.avatar)}`}
                                                    alt=""
                                                />

                                                <h2 className="font-bold">{item.name}</h2>
                                            </div>
                                        </Link>
                                        <button
                                            className="btn btn-sm md:btn-md"
                                            onClick={() => handleDelFriend(item)}
                                            disabled={isPendingDelF}
                                        >
                                            {isPendingDelF && <span className="loading loading-spinner"></span>}
                                            Hủy bạn bè
                                        </button>
                                    </div>
                                );
                            })}
                        </InfiniteScroll>
                    </>
                )}
            </div>
        </div>
    );
};

export default Friend;
