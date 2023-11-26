import React, { useMemo, useState } from 'react';
import getImage from '../../utils/getImage';
import calculateCreatedTime from '../../utils/calculateCreatedTime';
import { BsArrowReturnRight, BsShare } from 'react-icons/bs';
import Tippy from '@tippyjs/react/headless';
import EmojiPicker from 'emoji-picker-react';
import { PiSmileyWinkLight } from 'react-icons/pi';
import CardReplyComment from './CardReplyComment';
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PostServices from '../../services/PostService';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiDotsVerticalRounded } from 'react-icons/bi';
const CardComment = ({ comment, post, nameQuery }) => {
    const inputRef = React.useRef(null);

    const [isShowComment, setIsShowComment] = useState(false);
    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');
    const [showReply, setShowReply] = useState([]);
    const { user } = useSelector((state) => state.user);

    const queryClient = useQueryClient();
    const query = useLocation();

    const geyKeyPost = () => {
        const pathname = query.pathname;
        if (pathname === '/profile') return 'postsProfile';
        if (pathname == '/profile/') return 'postsUserProfile';
        if(pathname == '/group/') return 'postsDetailGroup'


        return 'postsHome';
    };

    const handleEmojiClick = (emojiData, event) => {
        setTextMessage((preText) => preText + emojiData.emoji);
        inputRef?.current?.focus();
    };

    const { mutate: deleteComment } = useMutation({
        mutationFn: PostServices.deleteComment,
        onSuccess: (data, variable) => {

            const keyPost = geyKeyPost()
            const oldData = queryClient.getQueryData([keyPost, null]);

            const pages = oldData.pages.map((page) => {
                const { data } = page;
                const currentPost = data.find((item) => item.id == post.id);
                const currentComment = currentPost.comments.find((item) => item.id == variable);
                if (currentComment) {
                    const newComments = currentPost.comments.filter((item) => item.id != variable);
                    console.log('currentPost', currentPost)
                    return { ...page, data: data.map((p) => (p.id == post.id ? { ...p, comments: newComments } : p)) };
                }

                return page;
            });

            queryClient.setQueryData([keyPost, null], { ...oldData, pages });
        },
    });

    const getChildrenComment = (commentId) => {
        return post.comments.filter((item) => item.parent_id == commentId);
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
        const parentId = comment.id;
        const content = textMessage.replace(/\n/g, '<br/>');
        if (content) {
            const payload = { postId, parentId, content };
            mutate(payload);
        }
    };

    const handleDeleteComment = () => {
        deleteComment(comment.id);
    };
    return (
        <div className="flex py-2 justify-between">
            <div className="flex gap-2 ">
                <Link to={user.id == comment.user_comment.id ? '/profile' : `/profile/${user.id}`}>
                    <img
                        src={getImage(comment.user_comment.avatar)}
                        className="w-[40px] h-[40px] rounded-full"
                        alt=""
                    />
                </Link>
                <div className="w-full">
                    <Link
                        to={user.id == comment.user_comment.id ? '/profile' : `/profile/${user.id}`}
                        className="link link-hover"
                    >
                        <h4 className="font-medium">{comment.user_comment.name || comment.user_comment.other_name}</h4>
                    </Link>
                    <p dangerouslySetInnerHTML={{ __html: comment.content }}></p>
                    <div className="text-xs flex items-center gap-1 mt-1">
                        <span className="mr-4">{calculateCreatedTime(comment.created_at)}</span>
                        <span className="link link-hover" onClick={() => setIsShowComment(true)}>
                            Phản hồi
                        </span>
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

                    {!showReply.includes(comment.id) && getChildrenComment(comment.id).length > 0 && (
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
                                <CardReplyComment
                                    comment={repComment}
                                    key={repComment.id}
                                    commentId={comment.id}
                                    nameQuery={nameQuery}
                                    post={post}
                                />
                            ))}
                    </div>
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
                        <ul tabIndex={0} className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-24">
                            <li>
                                <a onClick={handleDeleteComment}>Xóa</a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardComment;
