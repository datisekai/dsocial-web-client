import React, { useMemo, useState } from 'react';
import getImage from '../../utils/getImage';
import calculateCreatedTime from '../../utils/calculateCreatedTime';
import { AiOutlineHeart, AiOutlineShareAlt, AiFillHeart } from 'react-icons/ai';
import { BsArrowReturnRight, BsShare } from 'react-icons/bs';
import Tippy from '@tippyjs/react/headless';
import EmojiPicker from 'emoji-picker-react';
import { BiCommentDetail } from 'react-icons/bi';
import { PiSmileyWinkLight } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import CardReplyComment from './CardReplyComment';

const CardPost = ({ post }) => {
    const [isShowFullImage, setIsShowFullImage] = useState(false);

    const inputRef = React.useRef(null);

    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');

    const { user } = useSelector((state) => state.user);
    const handleEmojiClick = (emojiData, event) => {
        setTextMessage(textMessage + emojiData.emoji);
        inputRef?.current?.focus();
    };

    const [showReply, setShowReply] = useState([]);

    const isLiked = useMemo(() => {
        //TODO
        //- Kiểm tra xem user hiện tại có trong list user reaction hay không?
        //- Nếu có return true; ----Đã like
        //- Và ngược lại;

        return true;
    }, [post]);

    const parentComments = useMemo(() => {
        return post.comments.filter((item) => item.parent_id == 0);
    }, [post]);

    console.log(parentComments);

    const getChildrenComment = (commentId) => {
        return post.comments.filter((item) => item.parent_id == commentId);
    };

    return (
        <div className="p-4 bg-base-200 rounded w-full">
            <div className="flex items-center gap-2">
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <img src={`${post.user_post.avatar}`} />
                    </div>
                </div>
                <div>
                    {post.group && <p className="font-medium">{post.group.id}</p>}
                    <div className="text-sm space-x-2">
                        <span>{post.user_post.name}</span>
                        <span>·</span>
                        <span>{calculateCreatedTime(post.created_at)}</span>
                    </div>
                </div>
            </div>
            <article className="prose lg:prose-xl mt-2">{post.html}</article>

            <div className="mt-2 ">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(isShowFullImage ? post.images : [...post.images].splice(0, post.images.length)).map(
                        (item, index) => (
                            <img src={getImage(item.src)} key={index} className="w-full h-full" />
                        ),
                    )}
                </div>
                {post.images.length > 5 ? (
                    <button
                        onClick={() => setIsShowFullImage(!isShowFullImage)}
                        className="btn btn-sm md:btn-md btn-ghost mt-2"
                    >
                        {!isShowFullImage ? 'Xem thêm' : 'Thu gọn'}
                    </button>
                ) : (
                    <p>No</p>
                )}
            </div>

            <div className="flex items-center gap-2 py-2 border-t">
                <button className="btn btn-sm">
                    {isLiked ? <AiFillHeart size={23} /> : <AiOutlineHeart size={23} />}
                </button>
                <button className="btn btn-sm" onClick={() => inputRef?.current?.focus()}>
                    <BiCommentDetail size={20} />
                </button>
                {/* <button className="btn btn-sm">
                    <BsShare size={20} />
                </button> */}
            </div>

            <div className="">
                <div className="mt-2 bg-base-200 rounded">
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
                        <button className="btn btn-primary text-base-100">Gửi</button>
                    </div>
                </div>

                <h3>Bình luận</h3>
                <div className="space-y-2 mt-4">
                    {parentComments.map((item) => {
                        return (
                            <div key={item.id} >
                                <div className="flex gap-2 py-2">
                                    <img
                                        src={getImage(item.user_comment.avatar)}
                                        className="w-[40px] h-[40px] rounded-full"
                                        alt=""
                                    />
                                    <div className="">
                                        <h4 className="font-medium">{item.user_comment.name || item.user_comment.other_name}</h4>
                                        <p>{item.content}</p>
                                        {!showReply.includes(item.id) && getChildrenComment(item.id).length > 0 && (
                                            <div className="text-xs flex items-center link link-hover gap-1 mt-1">
                                                <BsArrowReturnRight />{' '}
                                                <span onClick={() => setShowReply([...showReply, item.id])}>
                                                    Xem {getChildrenComment(item.id).length} phản hồi
                                                </span>
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            {showReply.includes(item.id) &&
                                                getChildrenComment(item.id).map((repComment) => (
                                                    <CardReplyComment comment={repComment} key={repComment.id} />
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CardPost;
