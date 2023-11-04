import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useQueryParams from '../hooks/useQueryParams';
import FriendServices from '../services/FriendService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import getImage from '../utils/getImage';

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
    const [itemUser, setItemUser] = useState(null);

    const { user } = useSelector((state) => state.user);

    const { data: dataFriend, isLoading: isLoadingFriend } = useQuery({
        queryKey: ['friends', user.id],
        queryFn: () => {
            return FriendServices.getFriendByUserId(user.id);
        },
    });

    const { data: dataFriendRequest, isLoading: isLoadingFriendRequest } = useQuery({
        queryKey: ['friendRequests', user.id],
        queryFn: () => {
            return FriendServices.getFriendRequestByUserId();
        },
    });

    const { mutate: mutateAcceptFriend, isPending: isPendingAcceptF } = useMutation({
        mutationFn: FriendServices.acceptFriend,
        onSuccess: (data) => {
            Swal.fire('Thành công!', 'Đã đồng ý kết bạn', 'success');
            const currentFriend = queryClient.getQueryData(['friends', user.id]);
            const currentFriendResq = queryClient.getQueryData(['friendRequests', user.id]);
            if (currentFriend) {
                const newDataFriend = {
                    success: currentFriend.success,
                    data: [...currentFriend.data, itemUser],
                    pagination: currentFriend.pagination,
                };
                queryClient.setQueryData(['friends', user.id], newDataFriend);
                if (currentFriendResq) {
                    const newDataFriendRequest = {
                        success: currentFriendResq.success,
                        data: currentFriendResq.data.filter((item) => item.id !== itemUser.id),
                        pagination: currentFriendResq.pagination,
                    };
                    queryClient.setQueryData(['friendRequests', user.id], newDataFriendRequest);
                    setItemUser(null);
                }
            }
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
            Swal.fire('Thành công!', 'Đã xóa lời mời kết bạn', 'success');
            const currentFriendResq = queryClient.getQueryData(['friendRequests', user.id]);
            if (currentFriendResq) {
                const newDataFriendRequest = {
                    success: currentFriendResq.success,
                    data: currentFriendResq.data.filter((item) => item.id !== itemUser.id),
                    pagination: currentFriendResq.pagination,
                };
                console.log(newDataFriendRequest);
                queryClient.setQueryData(['friendRequests', user.id], newDataFriendRequest);
                setItemUser(null);
            }
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
            Swal.fire('Thành công!', 'Đã xóa bạn', 'success');
            const currentFriend = queryClient.getQueryData(['friends', user.id]);
            if (currentFriend) {
                const newDataFriend = {
                    success: currentFriend.success,
                    data: currentFriend.data.filter((item) => item.id !== itemUser.id),
                    pagination: currentFriend.pagination,
                };
                queryClient.setQueryData(['friends', user.id], newDataFriend);
                setItemUser(null);
            }
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const handleAcceptFriend = (values) => {
        setItemUser(values);
        mutateAcceptFriend(values.id);
    };

    const handleDelFriendReq = (values) => {
        setItemUser(values);
        mutateDelFriendReq(values.id);
    };

    const handleDelFriend = (values) => {
        setItemUser(values);
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
                        <div className="mt-4 space-y-2">
                            {!isLoadingFriendRequest &&
                                dataFriendRequest?.data.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <img
                                                className="rounded-full w-[70px] h-[70px]"
                                                src={`${getImage(item.avatar)}`}
                                                alt=""
                                            />
                                            <h2 className="font-bold">{item.name}</h2>
                                        </div>
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
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-primary font-bold">Bạn bè</h1>
                        <div className="mt-4 space-y-2">
                            {!isLoadingFriend &&
                                dataFriend?.data.map((item, index) => {
                                    return (
                                        <div className="flex items-center justify-between " key={index}>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    className="rounded-full w-[70px] h-[70px]"
                                                    src={`${getImage(item.avatar)}`}
                                                    alt=""
                                                />
                                                <h2 className="font-bold">{item.name}</h2>
                                            </div>
                                            <button
                                                className="btn btn-sm md:btn-md"
                                                onClick={() => handleDelFriend(item)}
                                            >
                                                {isPendingDelF && <span className="loading loading-spinner"></span>}
                                                Hủy bạn bè
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Friend;
