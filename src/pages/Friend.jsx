import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useQueryParams from '../hooks/useQueryParams';
import FriendServices from '../services/FriendService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import getImage from '../utils/getImage';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';

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
    const [text, setText] = useState('');

    const {
        data: dataFriend,
        isFetchingNextPage: isLoadingFriend,
        hasNextPage: hasNextpageFriend,
        fetchNextPage: fetchNextPageFriend,
    } = useInfiniteLoad(FriendServices.getFriendByUserId, 'friends', null);

    const {
        data: dataFriendRequest,
        isFetchingNextPage: isLoadingFriendRequest,
        hasNextPage: hasNextpageFriendRequest,
        fetchNextPage: fetchNextPageFriendRequest,
    } = useInfiniteLoad(FriendServices.getFriendRequestByUserId, 'friendRequests', null);

    const { mutate: mutateAcceptFriend, isPending: isPendingAcceptF } = useMutation({
        mutationFn: FriendServices.acceptFriend,
        onSuccess: (data) => {
            const type = 'delete-friendRequest';
            const id = data.data.id;
            updateStateFriend(data, id);

            updateStateDelete(data, id, type);
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
            const type = 'delete-friendRequest';
            const id = data.data.id;
            updateStateDelete(data, id, type);
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
            const type = 'delete-friend';
            const id = data.data.id;
            updateStateDelete(data, id, type);
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const navigate = useNavigate();

    const updateStateFriend = (data, id) => {
        const dataResult = data;
        const oldData = queryClient.getQueryData(['friends', undefined]);
        const pages = oldData.pages.map((page) => {
            const { data } = page;
            return {
                ...page,
                data: [dataResult.data, ...data],
            };
        });

        queryClient.setQueryData(['friends', undefined], { ...oldData, pages });
    };

    const updateStateDelete = (data, id, type) => {
        const oldData = queryClient.getQueryData([type == 'delete-friend' ? 'friends' : 'friendRequests', undefined]);
        const pages = oldData.pages.map((page) => {
            const { data } = page;
            const currentPost = data.find((item) => item.id == id);
            if (currentPost) {
                return { ...page, data: data.filter((item) => item.id !== id) };
            }
            return page;
        });

        queryClient.setQueryData([type == 'delete-friend' ? 'friends' : 'friendRequests', undefined], {
            ...oldData,
            pages,
        });
    };

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
                            {dataFriendRequest.length === 0 ? (
                                <div>Không có lời mời kết bạn nào</div>
                            ) : (
                                dataFriendRequest.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <Link to={`/profile/${item.id}`} className="link link-hover">
                                            <div className="flex items-center gap-2">
                                                <LazyLoadImage
                                                    effect="blur"
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
                                ))
                            )}
                        </InfiniteScroll>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between md:items-center flex-col md:flex-row items-start ">
                            <h1 className="text-primary font-bold">Bạn bè</h1>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Tìm kiếm bạn bè"
                                onKeyUp={(e) => {
                                    if (e.code == 'Enter' && text.trim().length !== 0) {
                                        navigate(`/search?query=${text}&action=friend`);
                                    }
                                }}
                                className="input input-bordered mt-2 md:mt-0 input-sm w-full max-w-xs"
                            />
                        </div>
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
                            {dataFriend.length === 0 ? (
                                <div>Không có bạn bè nào</div>
                            ) : (
                                dataFriend.map((item, index) => {
                                    return (
                                        <div className="flex items-center justify-between " key={index}>
                                            <Link to={`/profile/${item.id}`} className="link link-hover">
                                                <div className="flex items-center gap-2">
                                                    <LazyLoadImage
                                                        effect="blur"
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
                                })
                            )}
                        </InfiniteScroll>
                    </>
                )}
            </div>
        </div>
    );
};

export default Friend;
