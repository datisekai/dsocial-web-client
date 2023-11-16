import React, { useMemo, useState } from 'react';
import { FaRegAddressCard } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import CardPost from '../components/Card/CardPost';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import ProfileServices from '../services/ProfileService';
import getImage from '../utils/getImage';
import getDate from '../utils/getDate';
import PostServices from '../services/PostService';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import InfiniteScroll from 'react-infinite-scroll-component';
import FriendServices from '../services/FriendService';
import Swal from 'sweetalert2';
const UserProfile = () => {
    const { user } = useSelector((state) => state.user);
    const { userId } = useParams();
    const queryClient = useQueryClient();

    const { data: dataProfile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => {
            return ProfileServices.getProfileByUserId(userId);
        },
    });

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

    const {
        data: dataAllPosts,
        isFetchingNextPage: isLoadingAllPosts,
        hasNextPage: hasNextpageAllPosts,
        fetchNextPage: fetchNextPageAllPosts,
    } = useInfiniteLoad(PostServices.getPostByUserId, 'posts', userId);

    const { mutate, isPending } = useMutation({
        mutationFn: FriendServices.addFriend,
        onSuccess: (data) => {
            Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    // const isMyFriend = useMemo(() => dataFriend?.data.some((item) => +item.id === +userId), [dataFriend, userId]);
    // const isFriendRequest = useMemo(
    //     () => dataFriendRequest?.data.some((item) => +item.id === +userId),
    //     [dataFriendRequest, userId],
    // );
    // const isMyRequest = useMemo();

    const { mutate: mutateDelFriend, isPending: isPendingDelF } = useMutation({
        mutationFn: FriendServices.deleteFriend,
        onSuccess: (data) => {
            const currentFriend = queryClient.getQueryData(['friends', user.id]);
            if (currentFriend) {
                const newDataFriend = {
                    success: currentFriend.success,
                    data: currentFriend.data.filter((item) => item.id !== data.data.id),
                    pagination: currentFriend.pagination,
                };
                queryClient.setQueryData(['friends', user.id], newDataFriend);
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

    const handleDelFriend = (values) => {
        mutateDelFriend(values);
    };
    const handleSubmit = (values) => {
        mutate({ friendId: values });
    };

    const renderButton = () => {
        // if (!isLoadingFriend && isMyFriend)
        //     return (
        //         <button
        //             className="btn btn-sm md:btn-md btn-primary"
        //             onClick={() => handleDelFriend(userId)}
        //             disabled={isPendingDelF}
        //         >
        //             {isPendingDelF && <span className="loading loading-spinner"></span>}Hủy bạn bè
        //         </button>
        //     );
        // if (!isLoadingFriendRequest && isFriendRequest && !isLoadingFriend && !isMyFriend) {
        //     return (
        //         <button
        //             className="btn btn-sm md:btn-md btn-primary"
        //             onClick={() => handleSubmit(userId)}
        //             disabled={isPending}
        //         >
        //             {isPending && <span className="loading loading-spinner"></span>}Kết bạn
        //         </button>
        //     );
        // }
    };

    return (
        <div>
            {!isLoadingProfile && (
                <div className="relative">
                    <img
                        className="w-full h-auto aspect-video md:aspect-auto md:h-[250px] object-cover "
                        src={getImage(dataProfile.data.cover_image)}
                    />
                    <div className="absolute px-4 bottom-[-40px] left-0 right-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                className="rounded-full w-[80px] h-[80px] border-primary border-2"
                                src={getImage(dataProfile.data.avatar)}
                                alt=""
                            />
                            <div className="">
                                <h1 className="font-bold text-primary">{dataProfile.data.name}</h1>
                                <p className="text-[#828486]">{dataProfile.data.other_name}</p>
                            </div>
                        </div>
                        {/* {renderButton} */}
                    </div>
                </div>
            )}

            <div className="mt-[62px] px-4">
                {!isLoadingProfile &&
                    (dataProfile.data.bio || dataProfile.data.birthday || dataProfile.data.address) && (
                        <div className="bg-[#f5f5f5] p-4 space-y-2">
                            <h2 className="font-bold">Giới thiệu</h2>
                            {dataProfile.data.bio && <p>{dataProfile.data.bio}</p>}
                            {dataProfile.data.birthday && (
                                <div className="flex items-center gap-2">
                                    <LiaBirthdayCakeSolid size={22} /> <span>{getDate(dataProfile.data.birthday)}</span>
                                </div>
                            )}
                            {dataProfile.data.address && (
                                <div className="flex items-center gap-2">
                                    <FaRegAddressCard size={22} /> <span>{dataProfile.data.address}</span>
                                </div>
                            )}
                        </div>
                    )}

                <div className="bg-[#f5f5f5] p-4 space-y-2 mt-4">
                    <h2 className="font-bold">Bài viết</h2>
                    <InfiniteScroll
                        dataLength={dataAllPosts.length}
                        next={fetchNextPageAllPosts}
                        hasMore={hasNextpageAllPosts}
                        loader={
                            <div className="my-2 flex justify-center">
                                <span className="loading loading-dots loading-md"></span>
                            </div>
                        }
                    >
                        {dataAllPosts.length > 0 ? (
                            dataAllPosts.map((item, index) => {
                                return <CardPost key={index} post={item} />;
                            })
                        ) : (
                            <div>Kông có bài viết nào</div>
                        )}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
