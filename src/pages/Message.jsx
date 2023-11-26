import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoMdImages } from 'react-icons/io';
import { useSelector } from 'react-redux';
import Tippy from '@tippyjs/react/headless';
import EmojiPicker from 'emoji-picker-react';
import { PiSmileyWinkLight } from 'react-icons/pi';
import { LuSendHorizonal } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MessageService from '../services/MessageService';
import useInfiniteLoad from '../hooks/useInfiniteLoad';
import ProfileServices from '../services/ProfileService';
import { SocketContext } from '../contexts/SocketContext';
import getImage from '../utils/getImage';
import CardMessage from '../components/Card/CardMessage';
import useHandleMessage from '../hooks/useHandleMessage';

const Message = () => {
    const { user } = useSelector((state) => state.user);
    const { userActives } = useContext(SocketContext);
    const inputRef = React.useRef(null);

    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');

    const scrollRef = useRef(null);

    const { id = 0 } = useParams();
    const { handleSendText, handleSendImage, handleSendVideo, isSuccess, handleSeenMessage } = useHandleMessage({
        receiveId: id,
    });

    useEffect(() => {
        if (isSuccess) {
            setTextMessage('');
        }
    }, [isSuccess]);

    const { data: friend, isFetching: isFetchingFiend } = useQuery({
        queryKey: ['user', id],
        queryFn: () => ProfileServices.getProfileByUserId(id),
    });

    const { data } = useQuery({
        queryKey: ['message', id],
        queryFn: () => MessageService.getMessageByReceiveId({ id }),
    });

    // useEffect(() => {
    //     if (id && inputRef && inputRef.current && data) {
    //         inputRef.current.focus();

    //         const lastMessage = data[data.length - 1];
    //         if (!lastMessage.is_seen) {
    //             handleSeenMessage(lastMessage.id);
    //         }
    //     }
    // }, [id, data]);
    useEffect(() => {
        if (data && data.length > 0) {
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [data]);

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage(textMessage + emojiData.emoji);
        inputRef?.current?.focus();
    };

    const isOnline = useMemo(() => {
        if (!friend || !userActives) return false;

        return userActives.some((item) => item.id === friend.data.id);
    }, [userActives, friend]);

    return (
        <>
            {id ? (
                <div className="relative h-full">
                    <div className="flex items-center py-2 border-b px-4 gap-2 fixed bg-white z-10 right-0 left-0 md:left-[300px] top-[66px]">
                        <div className={`avatar ${isOnline ? 'online' : ''}`}>
                            <div className="w-12 rounded-full">
                                <img src={getImage(friend?.data.avatar)} />
                            </div>
                        </div>
                        <div>
                            <h2 className="font-medium">{friend?.data?.name}</h2>
                            {isOnline && <p className="text-sm">Đang hoạt động</p>}
                        </div>
                    </div>

                    <div className="px-4 mt-[70px] overflow-y-auto pb-[100px]">
                        {data?.map((item, index) => (
                            <CardMessage key={item.id} data={item} />
                        ))}
                    </div>
                    <div ref={scrollRef} id="scroll"></div>

                    <div className="mt-4 bg-base-200 p-4 rounded fixed md:left-[300px] left-0 right-0 bottom-0">
                        <div className="rounded flex">
                            <input
                                type="file"
                                className="hidden"
                                id="fileImage"
                                onChange={(e) => handleSendImage(e.target.files[0])}
                                accept="image/*"
                            />
                            <input
                                type="file"
                                className="hidden"
                                id="fileVideo"
                                accept="video/*"
                                onChange={(e) => handleSendVideo(e.target.files[0])}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <label htmlFor="fileImage" className="tooltip" data-tip="Hình ảnh">
                                        <div className="btn btn-xs md:btn-sm btn-ghost">
                                            <IoMdImages size={20} />
                                        </div>
                                    </label>
                                    <label htmlFor="fileVideo" className="tooltip" data-tip="Video">
                                        <div className="btn btn-xs md:btn-sm btn-ghost">
                                            <HiOutlineVideoCamera size={20} />
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <Tippy
                                            interactive={true}
                                            visible={showEmoji}
                                            onClickOutside={() => setShowEmoji(false)}
                                            placement="top-start"
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
                                                    className="btn btn-xs md:btn-sm btn-ghost"
                                                    onClick={() => setShowEmoji(!showEmoji)}
                                                >
                                                    <PiSmileyWinkLight size={20} />
                                                </div>
                                            </div>
                                        </Tippy>
                                    </div>
                                </div>
                            </div>

                            <input
                                ref={inputRef}
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                className="outline-none w-full py-2 rounded px-4"
                                placeholder={`${user.name ? `${user.name} ơi,` : ''} bạn đang nghĩ gì thế?`}
                                onKeyUp={(e) => {
                                    if (e.code == 'Enter') {
                                        handleSendText(textMessage);
                                    }
                                }}
                            ></input>
                            <div className="flex items-center">
                                <button onClick={() => handleSendText(textMessage)} className="btn btn-sm md:btn-md">
                                    Gửi <LuSendHorizonal />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p>Chọn bạn bè để nhắn tin</p>
                </div>
            )}
        </>
    );
};

export default Message;
