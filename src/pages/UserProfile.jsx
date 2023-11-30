import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { FaRegAddressCard } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import CardPost from '../components/Card/CardPost';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import { reloadMyFriend } from '../redux/slices/userSlice';
import FriendServices from '../services/FriendService';
import PostServices from '../services/PostService';
import ProfileServices from '../services/ProfileService';
import getDate from '../utils/getDate';
import getImage from '../utils/getImage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const UserProfile = () => {
    const { user } = useSelector((state) => state.user);
    const { userId } = useParams();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const { data: dataProfile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => {
            return ProfileServices.getProfileByUserId(userId);
        },
    });

    const { data: dataFriend, isLoading: isLoadingFriend } = useQuery({
        queryKey: ['friends', user.id],
        queryFn: () => {
            return FriendServices.getAllFriendByUserId(user.id);
        },
    });

    const { data: dataFriendRequest, isLoading: isLoadingFriendRequest } = useQuery({
        queryKey: ['friendRequests', user.id],
        queryFn: () => {
            return FriendServices.getAllFriendRequestByUserId();
        },
    });

    const { data: dataMyFriendRequest, isLoading: isLoadingMyFriendRequest } = useQuery({
        queryKey: ['myfriendRequests', user.id],
        queryFn: () => {
            return FriendServices.getAllMyRequestFriend();
        },
    });
    const isMyFriend = useMemo(() => dataFriend?.data.some((item) => +item.id === +userId), [dataFriend, userId]);
    const isFriendRequest = useMemo(
        () => dataFriendRequest?.data.some((item) => +item.id === +userId),
        [dataFriendRequest, userId],
    );
    const isMyFriendRequest = useMemo(
        () => dataMyFriendRequest?.data.some((item) => +item.id === +userId),
        [dataMyFriendRequest, userId],
    );

    const {
        data: dataAllPosts,
        isFetchingNextPage: isLoadingAllPosts,
        hasNextPage: hasNextpageAllPosts,
        fetchNextPage: fetchNextPageAllPosts,
    } = useInfiniteLoad(PostServices.getPostByUserId, 'postsUserProfile', userId);

    const { mutate, isPending } = useMutation({
        mutationFn: FriendServices.addFriend,
        onSuccess: (data) => {
            const currentMyFriendRequest = queryClient.getQueryData(['myfriendRequests', user.id]);
            if (currentMyFriendRequest) {
                const newDataMyFriendRequest = {
                    success: currentMyFriendRequest.success,
                    data: [data.data, ...currentMyFriendRequest.data],
                    pagination: currentMyFriendRequest.pagination,
                };
                queryClient.setQueryData(['myfriendRequests', user.id], newDataMyFriendRequest);
            }
            // Swal.fire('Thành công!', data.message, 'success');
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
            const currentFriend = queryClient.getQueryData(['friends', user.id]);
            if (currentFriend) {
                const newDataFriend = {
                    success: currentFriend.success,
                    data: currentFriend.data.filter((item) => item.id !== data.data.id),
                    pagination: currentFriend.pagination,
                };
                queryClient.setQueryData(['friends', user.id], newDataFriend);
                dispatch(reloadMyFriend());
            }
            // Swal.fire('Thành công!', data.message, 'success');
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
            const currentMyFriendRequest = queryClient.getQueryData(['myfriendRequests', user.id]);
            const currentFriendResq = queryClient.getQueryData(['friendRequests', user.id]);
            if (currentMyFriendRequest) {
                const newMyFriendRequest = {
                    success: currentMyFriendRequest.success,
                    data: currentMyFriendRequest.data.filter((item) => item.id !== data.data.id),
                    pagination: currentMyFriendRequest.pagination,
                };
                queryClient.setQueryData(['myfriendRequests', user.id], newMyFriendRequest);
            }
            if (currentFriendResq) {
                const newDataFriendRequest = {
                    success: currentFriendResq.success,
                    data: currentFriendResq.data.filter((item) => item.id !== data.data.id),
                    pagination: currentFriendResq.pagination,
                };
                queryClient.setQueryData(['friendRequests', user.id], newDataFriendRequest);
            }
            // Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });
    const { mutate: mutateAcceptFriend, isPending: isPendingAcceptF } = useMutation({
        mutationFn: FriendServices.acceptFriend,
        onSuccess: (data) => {
            const currentFriend = queryClient.getQueryData(['friends', user.id]);
            const currentFriendResq = queryClient.getQueryData(['friendRequests', user.id]);
            if (currentFriend) {
                const newDataFriend = {
                    success: currentFriend.success,
                    data: [data.data, ...currentFriend.data],
                    pagination: currentFriend.pagination,
                };

                queryClient.setQueryData(['friends', user.id], newDataFriend);
                if (currentFriendResq) {
                    const newDataFriendRequest = {
                        success: currentFriendResq.success,
                        data: currentFriendResq.data.filter((item) => item.id !== data.data.id),
                        pagination: currentFriendResq.pagination,
                    };
                    queryClient.setQueryData(['friendRequests', user.id], newDataFriendRequest);
                }

                dispatch(reloadMyFriend());
            }
            // Swal.fire('Thành công!', data.message, 'success');
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
    const handleDelFriendRequest = (values) => {
        mutateDelFriendReq(values);
    };
    const handleAcceptFriend = (values) => {
        mutateAcceptFriend(values);
    };

    return (
        <div>
            {!isLoadingProfile && (
                <div className="relative">
                    <LazyLoadImage effect='blur'
                        className="w-full h-auto aspect-video md:aspect-auto md:h-[250px] object-cover "
                        src={getImage(dataProfile.data.cover_image)}
                    />
                    <div className="absolute px-4 bottom-[-40px] left-0 right-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <LazyLoadImage effect='blur'
                                className="rounded-full w-[80px] h-[80px] border-primary border-2"
                                src={getImage(dataProfile.data.avatar)}
                                alt=""
                            />
                            <div className="">
                                <h1 className="font-bold text-primary">{dataProfile.data.name}</h1>
                                <p className="text-[#828486]">{dataProfile.data.other_name}</p>
                            </div>
                        </div>
                        {!isLoadingFriend && isMyFriend ? (
                            <button
                                className="btn btn-sm md:btn-md btn-primary"
                                onClick={() => handleDelFriend(userId)}
                                disabled={isPendingDelF}
                            >
                                {isPendingDelF && <span className="loading loading-spinner"></span>}Hủy bạn bè
                            </button>
                        ) : !isLoadingMyFriendRequest && isMyFriendRequest ? (
                            <button
                                className="btn btn-sm md:btn-md btn-primary"
                                onClick={() => handleDelFriendRequest(userId)}
                                disabled={isPendingDelFResq}
                            >
                                {isPendingDelFResq && <span className="loading loading-spinner"></span>}Hủy lời mời
                            </button>
                        ) : !isLoadingFriendRequest && isFriendRequest ? (
                            <div>
                                <button
                                    className="btn btn-sm md:btn-md btn-primary mr-2"
                                    onClick={() => handleAcceptFriend(userId)}
                                    disabled={isPendingAcceptF}
                                >
                                    {isPendingAcceptF && <span className="loading loading-spinner"></span>}Chấp nhận
                                </button>
                                <button
                                    className="btn btn-sm md:btn-md"
                                    onClick={() => handleDelFriendRequest(userId)}
                                    disabled={isPendingDelFResq}
                                >
                                    {isPendingDelFResq && <span className="loading loading-spinner"></span>}Xóa
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn btn-sm md:btn-md btn-primary"
                                onClick={() => handleSubmit(userId)}
                                disabled={isPending}
                            >
                                {isPending && <span className="loading loading-spinner"></span>}Kết bạn
                            </button>
                        )}
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
                                return <CardPost key={index} post={item} nameQuery={['postsUserProfile', undefined]} />;
                            })
                        ) : (
                            <div>Không có bài viết nào</div>
                        )}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
