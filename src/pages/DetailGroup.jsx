import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { kFormatter } from '../utils/common';
import useQueryParams from '../hooks/useQueryParams';
import Tippy from '@tippyjs/react/headless';
import { IoMdImages } from 'react-icons/io';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { PiSmileyWinkLight } from 'react-icons/pi';
import EmojiPicker from 'emoji-picker-react';
import CardPost from '../components/Card/CardPost';

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

    const inputRef = React.useRef(null);

    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage(textMessage + emojiData.emoji);
        inputRef?.current?.focus();
    };

    const action = query.get('action') || '';

    return (
        <div>
            <div className="relative">
                <img
                    className="w-full h-auto aspect-video md:aspect-auto md:h-[250px] object-cover "
                    src="https://images.unsplash.com/photo-1682685797661-9e0c87f59c60?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D"
                />

                <div className="absolute px-4 py-2 top-0 right-0 left-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-white">Tên nhóm</h1>
                            <p className="text-white">{kFormatter(20000)} thành viên</p>
                        </div>
                        <button className="btn btn-sm md:btn-md">Chỉnh sửa</button>
                    </div>
                </div>
                <div className="absolute px-4 bottom-[-40px] left-0 right-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            className="rounded-full w-[80px] h-[80px] border-primary border-2"
                            src="http://fakeimg.pl/50x50?font=lobster"
                            alt=""
                        />
                        <div className="">
                            <h1 className="font-bold text-primary">Thành Đạt</h1>
                            <p className="text-[#828486]">(datisekai)</p>
                        </div>
                    </div>

                    <button className="btn btn-sm md:btn-md btn-primary">Mời thành viên</button>
                </div>
            </div>

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
                        {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                            <CardPost key={index} />
                        ))} */}
                    </div>
                </div>
            )}

            {action == 'members' && (
                <div className="px-4 mt-4">
                    {[1, 2, 3, 4].map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b py-2">
                            <div className="flex items-center gap-2">
                                <img
                                    className="w-[50px] h-[50px] rounded-full"
                                    src="https://dummyimage.com/50x50.gif"
                                    alt=""
                                />
                                <div>
                                    {' '}
                                    <p className="font-bold">Jada Jackson</p>
                                    <p>Tham gia 2 tháng trước</p>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm md:btn-md">Xóa</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DetailGroup;
