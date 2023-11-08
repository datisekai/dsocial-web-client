import React, { useMemo, useState } from 'react';
import Feed from '../components/Feed';
import { useSelector } from 'react-redux';
import { IoMdImages } from 'react-icons/io';
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
        queryKey: ['home'],
        queryFn: () => {
            return PostServices.getAllPost();
        },
    });

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage(textMessage + emojiData.emoji);
        inputRef?.current?.focus();
    };

    const { mutate, isPending } = useMutation({
        mutationFn: PostServices.createPost,
        onSuccess: (data) => {
            const currenPostHome = queryClient.getQueryData(['home']);
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

        console.log(files);
        const payload = { html: textMessage, image: files };
        console.log('>>' + payload.image);
        mutate(payload);
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
                    <div className="overflow-auto h-auto flex w-full">
                        {previewImage?.map((item, index) => {
                            return item.type === 'image' ? (
                                <img
                                    key={index}
                                    className="w-[250px] h-auto aspect-square md:aspect-auto md:h-[250px] object-cover"
                                    src={item.file}
                                />
                            ) : (
                                <video
                                    controls
                                    key={index}
                                    className="border-none w-[350px] h-auto aspect-video md:aspect-auto md:h-[250px] object-cover"
                                    src={item.file}
                                    type={item.type}
                                />
                            );
                        })}
                    </div>

                    <input
                        type="file"
                        className="hidden"
                        id="fileImage"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && setFilePost([...filePost, e.target.files[0]])}
                    />
                    <input
                        type="file"
                        className="hidden"
                        id="fileVideo"
                        accept="video/mp4, video/mov"
                        onChange={(e) => e.target.files[0] && setFilePost([...filePost, e.target.files[0]])}
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
