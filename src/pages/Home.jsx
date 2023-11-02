import React from 'react';
import Feed from '../components/Feed';
import { useSelector } from 'react-redux';
import { IoMdImages } from 'react-icons/io';
import { PiSmileyWinkLight } from 'react-icons/pi';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import Tippy from '@tippyjs/react/headless';
import EmojiPicker from 'emoji-picker-react';
import CardPost from '../components/Card/CardPost';

const Home = () => {
    const { user } = useSelector((state) => state.user);
    const inputRef = React.useRef(null);

    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage(textMessage + emojiData.emoji);
        inputRef?.current?.focus();
    };

    return (
        <div className=' px-4 py-2'>
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
                        <div className='relative'>
                        <Tippy
                            interactive={true}
                            visible={showEmoji}
                            onClickOutside={() => setShowEmoji(false)}
                            placement='bottom'
                            render={(attrs) => (
                                <div {...attrs} className="mb-2">
                                    <EmojiPicker emojiVersion={'1.0'} height={"350px"} onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                        >
                            <div className="tooltip" data-tip="Cảm xúc">
                                <div className="btn btn-sm btn-ghost" onClick={() => setShowEmoji(!showEmoji)}>
                                    <PiSmileyWinkLight size={25} />
                                </div>
                            </div>
                        </Tippy></div>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="btn btn-primary text-base-100">Đăng</button>
                </div>
            </div>

            <div className='mt-8 space-y-2'>
             {[1,2,3,4,5,6,7,8,9,10].map((item,index) => <CardPost key={index}/>)} 
            </div>
        </div>
    );
};

export default Home;
