import React, { useState } from 'react';
import { BsArrowReturnRight } from 'react-icons/bs';
import getImage from '../../utils/getImage';
import calculateCreatedTime from '../../utils/calculateCreatedTime';
import Tippy from '@tippyjs/react/headless';
import { PiSmileyWinkLight } from 'react-icons/pi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PostServices from '../../services/PostService';
import EmojiPicker from 'emoji-picker-react';
import Swal from 'sweetalert2';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiDotsVerticalRounded } from 'react-icons/bi';
const CardReplyComment = ({ comment, commentId, nameQuery, post }) => {
    const [showReply, setShowReply] = useState([]);
    const { user } = useSelector((state) => state.user);
    const inputRef = React.useRef(null);
    const [textMessage, setTextMessage] = React.useState('');
    const [isShowComment, setIsShowComment] = useState(false);
    const [showEmoji, setShowEmoji] = React.useState(false);
    const queryClient = useQueryClient();
    const location = useLocation();

    console.log('local', location);

    const { mutate: deleteComment } = useMutation({
        mutationFn: PostServices.deleteComment,
        onSuccess: (data, variable) => {
            const oldData = queryClient.getQueryData(['postsHome', null]);

            const pages = oldData.pages.map((page) => {
                const { data } = page;
                const currentPost = data.find((item) => item.id == post.id);
                const currentComment = currentPost.comments.find((item) => item.id == variable);
                if (currentComment) {
                    const newComments = currentPost.comments.filter((item) => item.id != variable);
                    return { ...page, data: data.map((p) => (p.id == post.id ? { ...p, comments: newComments } : p)) };
                }

                return page;
            });

            queryClient.setQueryData(['postsHome', null], { ...oldData, pages });
        },
    });

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage((preText) => preText + emojiData.emoji);
        inputRef?.current?.focus();
    };
    console.log(comment);

    const getChildrenComment = (commentId) => {
        if (!comment.comments) return [];
        return comment.comments.filter((item) => item.parent_id == commentId);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: PostServices.createComment,
        onSuccess: (data) => {
            const currenPost = queryClient.getQueryData(nameQuery);

            if (currenPost) {
                const newPost = {
                    pageParams: currenPost.pageParams,
                    pages: [
                        {
                            success: currenPost.pages[0].success,
                            data: currenPost.pages[0].data.map((item) => {
                                if (item.id === data.data.post_id) {
                                    return {
                                        ...item,
                                        count_comment: item.count_comment + 1,
                                        comments: [data.data, ...item.comments],
                                    };
                                }
                                return item;
                            }),
                            pagination: currenPost.pages[0].pagination,
                        },
                    ],
                };
                queryClient.setQueryData(nameQuery, newPost);
            }
            setTextMessage('');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });
    const handleSubmit = () => {
        const postId = comment.post_id;
        const parentId = commentId;
        const content = textMessage.replace(/\n/g, '<br/>');
        if (content) {
            const payload = { postId, parentId, content };
            mutate(payload);
        }
    };

    return (
        <div>
            <div className="flex gap-2 py-2">
                <Link
                    to={user.id == comment.user_comment.id ? '/profile' : `/profile/${comment.user_comment.id}`}
                    className="w-10 h-10 rounded-full"
                >
                    <img src={getImage(comment.user_comment.avatar)} className="w-10 h-10 rounded-full" alt="" />
                </Link>
                <div className="w-full">
                    <div className="flex justify-between">
                        <div>
                            <Link
                                to={
                                    user.id == comment.user_comment.id
                                        ? '/profile'
                                        : `/profile/${comment.user_comment.id}`
                                }
                                className="link link-hover"
                            >
                                <h4 className="font-medium">
                                    {comment.user_comment.name || comment.user_comment.other_name}
                                </h4>
                            </Link>

                            <p dangerouslySetInnerHTML={{ __html: comment.content }}></p>
                            <div className="text-xs flex items-center gap-1 mt-1">
                                <span className="mr-4">{calculateCreatedTime(comment.created_at)}</span>
                                <span className="link link-hover" onClick={() => setIsShowComment(true)}>
                                    Phản hồi
                                </span>
                            </div>
                        </div>
                        <div>
                            {comment.author_id == user.id && (
                                <div className="dropdown dropdown-left">
                                    <label tabIndex={0}>
                                        <div className="btn btn-ghost btn-sm">
                                            <BiDotsVerticalRounded size={25} />
                                        </div>
                                    </label>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-24"
                                    >
                                        <li>
                                            <a onClick={() => deleteComment(comment.id)}>Xóa</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    {isShowComment && (
                        <div className="mt-2 bg-base-200 rounded">
                            <div className="bg-base-100 rounded">
                                <textarea
                                    ref={inputRef}
                                    value={textMessage}
                                    onChange={(e) => setTextMessage(e.target.value)}
                                    className="textarea w-full outline-none rounded"
                                    placeholder="Viết bình luận..."
                                ></textarea>

                                <div className="flex items-center justify-between">
                                    <div className="relative w-full">
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
                                    <div className="flex justify-end mb-1 mr-2">
                                        <button
                                            className="btn btn-primary text-base-100"
                                            onClick={handleSubmit}
                                            disabled={isPending}
                                        >
                                            {isPending && <span className="loading loading-spinner"></span>}
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* {!showReply.includes(comment.id) && getChildrenComment(comment.id).length > 0 && (
                        <div className="text-xs flex items-center link link-hover gap-1 mt-1">
                            <BsArrowReturnRight />{' '}
                            <span onClick={() => setShowReply([...showReply, comment.id])}>
                                Xem {getChildrenComment(comment.id).length} phản hồi
                            </span>
                        </div>
                    )}
                    <div className="ml-4">
                        {showReply.includes(comment.id) &&
                            getChildrenComment(comment.id).map((repComment) => (
                                <CardReplyComment {...repComment} key={repComment.id} />
                            ))}
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default CardReplyComment;
