import React, { useMemo, useState } from 'react';
import Feed from '../components/Feed';
import { useSelector } from 'react-redux';
import { IoMdCloseCircle, IoMdImages } from 'react-icons/io';
import { PiSmileyWinkLight } from 'react-icons/pi';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import Tippy from '@tippyjs/react/headless';
import EmojiPicker from 'emoji-picker-react';
import CardPost from '../components/Card/CardPost';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PostServices from '../services/PostService';
import { uploadsServer } from '../utils/axiosClient';
import Swal from 'sweetalert2';
const Home = () => {
    const { user } = useSelector((state) => state.user);
    const inputRef = React.useRef(null);
    const queryClient = useQueryClient();

    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');
    const [filePost, setFilePost] = useState([]);
    const previewImage = useMemo(() => {
        return filePost.map((item) => {
            return { type: item.type.split('/')[0], file: URL.createObjectURL(item) };
        });
    }, [filePost]);

    const { data, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: () => {
            return PostServices.getAllPost();
        },
    });

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage((preText) => preText + emojiData.emoji);
        inputRef?.current?.focus();
    };

    const { mutate, isPending } = useMutation({
        mutationFn: PostServices.createPost,
        onSuccess: (data) => {
            const currenPostHome = queryClient.getQueryData(['posts']);
            if (currenPostHome) {
                console.log(data.data);
                const newPostHome = {
                    success: currenPostHome.success,
                    data: [data.data, ...currenPostHome.data],
                    pagination: currenPostHome.pagination,
                };
                queryClient.setQueryData(['posts'], newPostHome);
                console.log(currenPostHome.data);
            }
            setTextMessage('');
            setFilePost([]);
            Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const handleSubmitPost = async () => {
        let files = [];
        if (filePost.length !== 0) {
            const resultFilePost = await uploadsServer(filePost);
            files = resultFilePost.data;
        }
        const payload = { html: textMessage.replace(/\n/g, '<br/>'), image: files };
        mutate(payload);
    };
    const handleDeleteFile = (indexDel) => {
        setFilePost(filePost.filter((item, index) => index !== indexDel));
    };
    return (
        <div className=" px-4 py-2">
            <h1 className="text-primary font-bold">Home</h1>
            <div className="mt-2">
                <Feed />
            </div>
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
                                    <img
                                        className="w-[130px] md:w-[180px] h-auto aspect-square md:h-[180px] object-cover"
                                        src={item.file}
                                    />
                                </div>
                            ) : (
                                <div key={index} className="relative">
                                    <IoMdCloseCircle
                                        onClick={() => handleDeleteFile(index)}
                                        className="z-[9999] absolute right-0 text-2xl cursor-pointer text-[#6419E6]"
                                    />
                                    <video
                                        controls
                                        className="w-[130px] md:w-[180px] h-auto aspect-video md:h-[180px] object-cover"
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
                                    <div className="btn btn-sm btn-ghost" onClick={() => setShowEmoji(!showEmoji)}>
                                        <PiSmileyWinkLight size={25} />
                                    </div>
                                </div>
                            </Tippy>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="btn btn-primary text-base-100" onClick={handleSubmitPost} disabled={isPending}>
                        {isPending && <span className="loading loading-spinner"></span>}
                        Đăng
                    </button>
                </div>
            </div>

            <div className="mt-8 space-y-2">
                {!isLoading && data?.data.map((item, index) => <CardPost key={index} post={item} />)}
            </div>
        </div>
    );
};

export default Home;
