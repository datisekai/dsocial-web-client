import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { kFormatter } from '../utils/common';
import useQueryParams from '../hooks/useQueryParams';
import Tippy from '@tippyjs/react/headless';
import { IoMdCloseCircle, IoMdImages } from 'react-icons/io';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { PiSmileyWinkLight } from 'react-icons/pi';
import EmojiPicker from 'emoji-picker-react';
import CardPost from '../components/Card/CardPost';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import GroupServices from '../services/GroupService';
import getImage from '../utils/getImage';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import calculateCreatedTime from '../utils/calculateCreatedTime';
import PostServices from '../services/PostService';
import { uploadsServer } from '../utils/axiosClient';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const tabs = [
    {
        action: '',
        title: 'Thảo luận',
    },
    {
        action: 'members',
        title: 'Thành viên',
    },
];

const DetailGroup = () => {
    const { id } = useParams();
    const query = useQueryParams();
    const queryClient = useQueryClient();
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const inputRef = React.useRef(null);

    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');
    const [filePost, setFilePost] = React.useState([]);
    const previewImage = useMemo(() => {
        return filePost.map((item) => {
            return { type: item.type.split('/')[0], file: URL.createObjectURL(item) };
        });
    }, [filePost]);

    const { data: dataDetailGroup, isLoading: isLoadingDetailGroup } = useQuery({
        queryKey: ['detailgroup'],
        queryFn: () => {
            return GroupServices.getDetailGroup(id);
        },
    });
    console.log(dataDetailGroup);

    const {
        data: dataAllPosts,
        isFetchingNextPage: isLoadingAllPosts,
        hasNextPage: hasNextpageAllPosts,
        fetchNextPage: fetchNextPageAllPosts,
    } = useInfiniteLoad(PostServices.getPostDetailGroup, 'postsDetailGroup', id);

    const {
        data: dataAllUsers,
        isFetchingNextPage: isLoadingAllUsers,
        hasNextPage: hasNextpageAllUsers,
        fetchNextPage: fetchNextPageAllUsers,
    } = useInfiniteLoad(GroupServices.getAllUserJoined, 'usersDetailGroup', id);

    const { mutate, isPending } = useMutation({
        mutationFn: PostServices.createPost,
        onSuccess: (data) => {
            updateStatePost(data);
            setTextMessage('');
            setFilePost([]);
            // Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const { mutate: mutateKickUser, isPending: isPendingKickUser } = useMutation({
        mutationFn: GroupServices.kickUser,
        onSuccess: (data) => {
            const id = data.data.id;
            console.log(data.data);
            updateStateKickUser(data, id);
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const { mutate: mutateOutGroup, isPending: isPendingOutGroup } = useMutation({
        mutationFn: GroupServices.outGroup,
        onSuccess: (data) => {
            Swal.fire('Thành công!', data.message, 'success');
            navigate('/group');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const { mutate: mutateDeleteGroup, isPending: isPendingDeleteGroup } = useMutation({
        mutationFn: GroupServices.deleteGroup,
        onSuccess: (data) => {
            Swal.fire('Thành công!', data.message, 'success');
            navigate('/group');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const updateStatePost = (data) => {
        const dataResult = data;
        const oldData = queryClient.getQueryData(['postsDetailGroup', undefined]);
        const pages = oldData.pages.map((page) => {
            const { data } = page;
            return {
                ...page,
                data: [{ ...dataResult.data, created_at: Date.now() }, ...data],
            };
        });

        queryClient.setQueryData(['postsDetailGroup', undefined], { ...oldData, pages });
    };
    const updateStateKickUser = (data, id) => {
        const dataResult = data;
        const oldData = queryClient.getQueryData(['usersDetailGroup', undefined]);
        const pages = oldData.pages.map((page) => {
            const { data } = page;
            const currentPost = data.find((item) => item.id == id);
            console.log(currentPost);
            if (currentPost) {
                return {
                    ...page,
                    data: data.filter((item) => item.id !== dataResult.data.id),
                };
            }
            return page;
        });

        queryClient.setQueryData(['usersDetailGroup', undefined], { ...oldData, pages });
    };

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage((preText) => preText + emojiData.emoji);
        inputRef?.current?.focus();
    };
    const action = query.get('action') || '';

    const handleSubmitKickUser = (values) => {
        console.log(values);
        mutateKickUser({ groupId: id, userId: values });
    };
    const handleSubmiitOutGroup = () => {
        mutateOutGroup({ groupId: id });
    };
    const handleSubmiitDeleteGroup = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa nhóm này?',
            showDenyButton: true,
            confirmButtonText: 'Chắc chắn',
            denyButtonText: `Hủy `,
        }).then((result) => {
            if (result.isConfirmed) {
                mutateDeleteGroup(id);
            }
        });
    };
    const handleSubmitPost = async () => {
        if (textMessage == '') {
            return Swal.fire('Thất bại!', 'Hãy nhập cảm nghĩ của bạn', 'error');
        }
        let files = [];
        if (filePost.length !== 0) {
            const resultFilePost = await uploadsServer(filePost);
            files = resultFilePost.data;
        }
        const payload = { html: textMessage.replace(/\n/g, '<br/>'), image: files, groupId: id };
        mutate(payload);
    };
    const handleDeleteFile = (indexDel) => {
        setFilePost(filePost.filter((item, index) => index !== indexDel));
    };
    return (
        <div>
            {!isLoadingDetailGroup && (
                <div className="relative">
                    <LazyLoadImage effect='blur'
                        className="w-full h-auto aspect-video md:aspect-auto md:h-[250px] object-cover "
                        src={getImage(dataDetailGroup?.data.cover_image)}
                    />

                    <div className="absolute px-4 py-2 top-0 right-0 left-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-bold text-white">{dataDetailGroup?.data.name}</h1>
                                <p className="text-white">{kFormatter(dataDetailGroup?.data.countJoined)} thành viên</p>
                            </div>
                            {dataDetailGroup?.data.user_own.id == user.id ? (
                                <Link to={`/group/${id}/edit`}>
                                    <button className="btn btn-sm md:btn-md">Chỉnh sửa</button>
                                </Link>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <div className="absolute px-4 bottom-[-40px] left-0 right-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <LazyLoadImage effect='blur'
                                className="rounded-full w-[80px] h-[80px] border-primary border-2"
                                src={getImage(dataDetailGroup?.data.avatar)}
                                alt=""
                            />
                            <div className="">
                                <h1 className="font-bold text-primary">{dataDetailGroup?.data.name}</h1>
                                <p className="text-[#828486]">({dataDetailGroup?.data.user_own.name})</p>
                            </div>
                        </div>

                        {dataDetailGroup?.data.user_own.id == user.id ? (
                            <button
                                className="btn btn-sm md:btn-md btn-primary"
                                disabled={isPendingDeleteGroup}
                                onClick={handleSubmiitDeleteGroup}
                            >
                                {isPendingDeleteGroup && <span className="loading loading-spinner"></span>}
                                Xóa nhóm
                            </button>
                        ) : (
                            <button
                                className="btn btn-sm md:btn-md btn-primary"
                                disabled={isPendingOutGroup}
                                onClick={() => handleSubmiitOutGroup(dataDetailGroup?.data.id)}
                            >
                                {isPendingOutGroup && <span className="loading loading-spinner"></span>}
                                Rời nhóm
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-[60px] px-4">
                <div className="flex items-center gap-2 flex-wrap">
                    {tabs.map((tab, index) => (
                        <Link key={index} to={tab.action ? `/group/${id}?action=${tab.action}` : `/group/${id}`}>
                            <button className={`btn btn-sm ${action === tab.action ? 'btn-primary' : ''}`}>
                                {tab.title}
                            </button>
                        </Link>
                    ))}
                </div>
            </div>

            {!action && (
                <div>
                    <div className="mt-4 bg-base-200 p-4 rounded">
                        <div className="bg-base-100 rounded">
                            <textarea
                                ref={inputRef}
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                className="textarea w-full outline-none rounded"
                                placeholder={`${user.name ? `${user.name} ơi,` : ''} bạn đang nghĩ gì thế?`}
                            ></textarea>
                            <div className="overflow-auto h-auto flex w-full flex-wrap">
                                {previewImage?.map((item, index) => {
                                    return item.type === 'image' ? (
                                        <div key={index} className="relative ml-2">
                                            <IoMdCloseCircle
                                                onClick={() => handleDeleteFile(index)}
                                                className="absolute right-0 text-2xl cursor-pointer text-[#6419E6]"
                                            />
                                            <LazyLoadImage effect='blur'
                                                className="w-[130px] md:w-[180px] h-auto aspect-square md:h-[180px] object-cover"
                                                src={item.file}
                                            />
                                        </div>
                                    ) : (
                                        <div key={index} className="relative ml-2">
                                            <IoMdCloseCircle
                                                onClick={() => handleDeleteFile(index)}
                                                className="z-[9999] absolute right-0 text-2xl cursor-pointer text-[#6419E6]"
                                            />
                                            <video
                                                controls
                                                className="w-[130px] md:w-[180px] h-[130px] aspect-video md:h-[180px] object-cover"
                                                src={item.file}
                                                type={item.type}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <input
                                multiple
                                type="file"
                                className="hidden"
                                id="fileImage"
                                accept="image/*"
                                onChange={(e) => e.target.files[0] && setFilePost([...filePost, ...e.target.files])}
                            />
                            <input
                                multiple
                                type="file"
                                className="hidden"
                                id="fileVideo"
                                accept="video/mp4, video/mov"
                                onChange={(e) => e.target.files[0] && setFilePost([...filePost, ...e.target.files])}
                            />
                            <div className="flex items-center">
                                <label htmlFor="fileImage" className="tooltip" data-tip="Hình ảnh">
                                    <div className="btn btn-sm btn-ghost">
                                        <IoMdImages size={25} />
                                    </div>
                                </label>
                                <label htmlFor="fileVideo" className="tooltip" data-tip="Video">
                                    <div className="btn btn-sm btn-ghost">
                                        <HiOutlineVideoCamera size={25} />
                                    </div>
                                </label>
                                <div className="relative">
                                    <Tippy
                                        interactive={true}
                                        visible={showEmoji}
                                        onClickOutside={() => setShowEmoji(false)}
                                        placement="bottom"
                                        render={(attrs) => (
                                            <div {...attrs} className="mb-2">
                                                <EmojiPicker
                                                    emojiVersion={'1.0'}
                                                    height={'350px'}
                                                    onEmojiClick={handleEmojiClick}
                                                />
                                            </div>
                                        )}
                                    >
                                        <div className="tooltip" data-tip="Cảm xúc">
                                            <div
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => setShowEmoji(!showEmoji)}
                                            >
                                                <PiSmileyWinkLight size={25} />
                                            </div>
                                        </div>
                                    </Tippy>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="btn btn-primary text-base-100" onClick={handleSubmitPost}>
                                Đăng
                            </button>
                        </div>
                    </div>

                    <InfiniteScroll
                        dataLength={dataAllPosts.length}
                        next={fetchNextPageAllPosts}
                        hasMore={hasNextpageAllPosts}
                        className="mt-8 space-y-2"
                        loader={
                            <div className="my-2 flex justify-center">
                                <span className="loading loading-dots loading-md"></span>
                            </div>
                        }
                    >
                        {dataAllPosts.map((item, index) => (
                            <CardPost
                                group={dataDetailGroup.data}
                                key={index}
                                post={item}
                                nameQuery={['postsDetailGroup', undefined]}
                            />
                        ))}
                    </InfiniteScroll>
                </div>
            )}

            {action == 'members' && (
                <InfiniteScroll
                    dataLength={dataAllUsers.length}
                    next={fetchNextPageAllUsers}
                    hasMore={hasNextpageAllUsers}
                    className="px-4 mt-4"
                    loader={
                        <div className="my-2 flex justify-center">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    }
                >
                    {!isLoadingAllUsers &&
                        !isLoadingDetailGroup &&
                        [dataDetailGroup?.data.user_own, ...dataAllUsers]?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between border-b py-2">
                                <div className="flex items-center gap-2">
                                    <LazyLoadImage effect='blur'
                                        className="w-[50px] h-[50px] rounded-full"
                                        src={getImage(item.avatar)}
                                        alt=""
                                    />
                                    <div>
                                        <p className="font-bold">
                                            {item.name}
                                            {item.id == dataDetailGroup?.data.user_own.id
                                                ? ' (Chủ nhóm)'
                                                : ' (Thành viên)'}
                                        </p>
                                        <p>
                                            {calculateCreatedTime(item.joined_date) == 'Ngay bây giờ'
                                                ? 'Vừa vào nhóm'
                                                : 'Đã tham gia ' + calculateCreatedTime(item.joined_date)}
                                        </p>
                                    </div>
                                </div>
                                {!isLoadingDetailGroup &&
                                dataDetailGroup?.data.user_own.id == user.id &&
                                item.id != user.id ? (
                                    <button
                                        className="btn btn-ghost btn-sm md:btn-md"
                                        disabled={isPendingKickUser}
                                        onClick={() => handleSubmitKickUser(item.id)}
                                    >
                                        {isPendingKickUser && <span className="loading loading-spinner"></span>}
                                        Xóa
                                    </button>
                                ) : (
                                    ''
                                )}
                            </div>
                        ))}
                </InfiniteScroll>
            )}
        </div>
    );
};

export default DetailGroup;
