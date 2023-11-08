import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { kFormatter } from '../utils/common';
import useQueryParams from '../hooks/useQueryParams';
import Tippy from '@tippyjs/react/headless';
import { IoMdImages } from 'react-icons/io';
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

    const { data: dataDetailGroup, isLoading: isLoadingDetailGroup } = useQuery({
        queryKey: ['detailgroup'],
        queryFn: () => {
            return GroupServices.getDetailGroup(id);
        },
    });

    const { data: dataPostDetailGroup, isLoading: isLoadingPostDetailGroup } = useQuery({
        queryKey: ['postdetailgroup'],
        queryFn: () => {
            return PostServices.getPostDetailGroup(id);
        },
    });

    const { mutate: mutateKickUser, isPending: isPendingKickUser } = useMutation({
        mutationFn: GroupServices.kickUser,
        onSuccess: (data) => {
            const currentDetailGroup = queryClient.getQueryData(['detailgroup']);

            if (currentDetailGroup) {
                const newDataDetailGroup = {
                    success: currentDetailGroup.success,
                    data: {
                        ...currentDetailGroup.data,
                        users_joined: currentDetailGroup.data.users_joined.filter((item) => item.id !== data.data.id),
                    },
                };
                queryClient.setQueryData(['detailgroup'], newDataDetailGroup);
            }
            console.log(currentDetailGroup);
            Swal.fire('Thành công!', data.message, 'success');
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
            const currentDetailGroup = queryClient.getQueryData(['detailgroup']);

            if (currentDetailGroup) {
                const newDataDetailGroup = {
                    success: currentDetailGroup.success,
                    data: {
                        ...currentDetailGroup.data,
                        users_joined: currentDetailGroup.data.users_joined.filter((item) => item.id !== data.data.id),
                    },
                };
                queryClient.setQueryData(['detailgroup'], newDataDetailGroup);
            }
            console.log(currentDetailGroup);
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

    const inputRef = React.useRef(null);

    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage(textMessage + emojiData.emoji);
        inputRef?.current?.focus();
    };
    const action = query.get('action') || '';

    const handleSubmitKickUser = (values) => {
        mutateKickUser({ groupId: id, userId: values.id + '' });
    };
    const handleSubmiitOutGroup = () => {
        mutateOutGroup({ groupId: id });
    };
    const handleSubmiitDeleteGroup = () => {
        mutateDeleteGroup(id);
    };
    return (
        <div>
            {!isLoadingDetailGroup && (
                <div className="relative">
                    <img
                        className="w-full h-auto aspect-video md:aspect-auto md:h-[250px] object-cover "
                        src={getImage(dataDetailGroup?.data.cover_image)}
                    />

                    <div className="absolute px-4 py-2 top-0 right-0 left-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-bold text-white">{dataDetailGroup?.data.name}</h1>
                                <p className="text-white">
                                    {kFormatter(dataDetailGroup?.data.users_joined.length)} thành viên
                                </p>
                            </div>
                            <button className="btn btn-sm md:btn-md">Chỉnh sửa</button>
                        </div>
                    </div>
                    <div className="absolute px-4 bottom-[-40px] left-0 right-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                className="rounded-full w-[80px] h-[80px] border-primary border-2"
                                src={dataDetailGroup?.data.avatar}
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
                                // placeholder={`${user.name ? `${user.name} ơi,` : ''} bạn đang nghĩ gì thế?`}
                            ></textarea>

                            <input type="file" className="hidden" id="fileImage" accept="image/*" />
                            <input type="file" className="hidden" id="fileVideo" accept="video/*" />
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
                            <button className="btn btn-primary text-base-100">Đăng</button>
                        </div>
                    </div>

                    <div className="mt-8 space-y-2">
                        {!isLoadingPostDetailGroup &&
                            dataPostDetailGroup?.data.map((item, index) => <CardPost key={index} post={item} />)}
                    </div>
                </div>
            )}

            {action == 'members' && (
                <div className="px-4 mt-4">
                    {!isLoadingDetailGroup &&
                        dataDetailGroup?.data.users_joined.map((item, index) => (
                            <div key={index} className="flex items-center justify-between border-b py-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        className="w-[50px] h-[50px] rounded-full"
                                        src="https://dummyimage.com/50x50.gif"
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
                                        onClick={handleSubmitKickUser}
                                    >
                                        {isPendingKickUser && <span className="loading loading-spinner"></span>}
                                        Xóa
                                    </button>
                                ) : (
                                    ''
                                )}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default DetailGroup;
