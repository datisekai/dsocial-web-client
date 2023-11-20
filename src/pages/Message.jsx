import React from 'react';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoMdImages } from 'react-icons/io';
import { useSelector } from 'react-redux';
import Tippy from '@tippyjs/react/headless';
import EmojiPicker from 'emoji-picker-react';
import { PiSmileyWinkLight } from 'react-icons/pi';
import { LuSendHorizonal } from 'react-icons/lu';
import { useParams } from 'react-router-dom';

const Message = () => {
    const { user } = useSelector((state) => state.user);
    const inputRef = React.useRef(null);

    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');

    const { id } = useParams();
    console.log('id', id);

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage(textMessage + emojiData.emoji);
        inputRef?.current?.focus();
    };
    return (
        <>
            {' '}
            {id ? (
                <div className="relative h-full">
                    <div className="flex items-center py-2 border-b px-4 gap-2">
                        <div className="avatar online">
                            <div className="w-12 rounded-full">
                                <img src="https://dummyimage.com/40x40.gif" />
                            </div>
                        </div>
                        <div>
                            <h2 className="font-medium">Thành Đạt</h2>
                            <p className="text-sm">Đang hoạt động</p>
                        </div>
                    </div>

                    <div className="px-4 mt-4 overflow-y-auto pb-[168px]">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                            <div key={index} className={`chat ${index % 2 == 0 ? 'chat-start' : 'chat-end'}`}>
                                <div className="chat-image avatar">
                                    <div className="w-12 rounded-full">
                                        <img src="https://dummyimage.com/40x40.gif" />
                                    </div>
                                </div>
                                <div className="chat-header">
                                    Obi-Wan Kenobi
                                    <time className="text-xs opacity-50">12:45</time>
                                </div>
                                <div className="chat-bubble">You were the Chosen One!</div>
                                <div className="chat-footer opacity-50">Delivered</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 bg-base-200 p-4 rounded fixed md:left-[300px] left-0 right-0 bottom-0">
                        <div className="rounded flex">
                            <input type="file" className="hidden" id="fileImage" accept="image/*" />
                            <input type="file" className="hidden" id="fileVideo" accept="video/*" />
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
                            ></input>
                            <div className='flex items-center'>
                                <button className="btn btn-sm md:btn-md">
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
