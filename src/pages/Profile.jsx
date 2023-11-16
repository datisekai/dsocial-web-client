import React from 'react';
import { FaRegAddressCard } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import CardPost from '../components/Card/CardPost';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import ProfileServices from '../services/ProfileService';
import getImage from '../utils/getImage';
import getDate from '../utils/getDate';
import PostServices from '../services/PostService';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import InfiniteScroll from 'react-infinite-scroll-component';
const Profile = () => {
    const { user } = useSelector((state) => state.user);

    const { data: dataProfile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile', user.id],
        queryFn: () => {
            return ProfileServices.getProfileByUserId(user.id);
        },
    });

    const {
        data: dataAllPosts,
        isFetchingNextPage: isLoadingAllPosts,
        hasNextPage: hasNextpageAllPosts,
        fetchNextPage: fetchNextPageAllPosts,
    } = useInfiniteLoad(PostServices.getPostByUserId, 'postsProfile', null);

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

                        <Link to={'/profile/edit'}>
                            <button className="btn btn-sm md:btn-md btn-primary">Chỉnh sửa</button>
                        </Link>
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
                                return <CardPost key={index} post={item} nameQuery={'postsProfile'} />;
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

export default Profile;
