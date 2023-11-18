import React, { useMemo, useState } from 'react';
import getImage from '../../utils/getImage';
import calculateCreatedTime from '../../utils/calculateCreatedTime';
import { AiOutlineHeart, AiOutlineShareAlt, AiFillHeart } from 'react-icons/ai';
import { BsArrowReturnRight, BsShare } from 'react-icons/bs';
import Tippy from '@tippyjs/react/headless';
import EmojiPicker from 'emoji-picker-react';
import { BiCommentDetail, BiDotsVerticalRounded } from 'react-icons/bi';
import { PiSmileyWinkLight } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PostServices from '../../services/PostService';
import { Link } from 'react-router-dom';
import CardComment from './CardComment';
import useUser from '../../hooks/useUser';
import UpdatePostModal from '../Modal/UpdatePostModal';

const CardPost = ({ post, nameQuery }) => {
    const [isShowFullImage, setIsShowFullImage] = useState(false);
    const [isShowFullComment, setIsShowFullComment] = useState(false);
    const inputRef = React.useRef(null);

    const [showEmoji, setShowEmoji] = React.useState(false);
    const [textMessage, setTextMessage] = React.useState('');

    const [visibleActivePost, setVisibleActivePost] = useState(false);

    const { user } = useUser();

    const queryClient = useQueryClient();
    const handleEmojiClick = (emojiData, event) => {
        setTextMessage((preText) => preText + emojiData.emoji);
        inputRef?.current?.focus();
    };

    const [iconId, setIconId] = useState(0);
    const isLiked = useMemo(() => {
        let isChecked = false;
        post.reactions.map((item) => {
            if (item.user_reaction.id == user.id) {
                setIconId(item.id);
                isChecked = true;
            }
        });
        if (isChecked) {
            return true;
        }
        return false;
    }, [post]);
    const parentComments = useMemo(() => {
        return post.comments.filter((item) => item.parent_id == 0);
    }, [post]);

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

    const { mutate: mutateReaction, isPending: isPendingReaction } = useMutation({
        mutationFn: PostServices.createReaction,
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
                                        count_reaction: item.count_reaction + 1,
                                        reactions: [...item.reactions, data.data],
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
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });
    const { mutate: mutateReactionDel, isPending: isPendingReactionDel } = useMutation({
        mutationFn: PostServices.deleteReaction,
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
                                        count_reaction: item.count_reaction - 1,
                                        reactions: item.reactions.filter((item) => item.id !== data.data.id),
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
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const { mutate: mutatePostDel, isPending: isPendingPostDel } = useMutation({
        mutationFn: PostServices.deletePost,
        onSuccess: (data) => {
            const currenPost = queryClient.getQueryData(nameQuery);

            if (currenPost) {
                const newPost = {
                    pageParams: currenPost.pageParams,
                    pages: [
                        {
                            success: currenPost.pages[0].success,
                            data: currenPost.pages[0].data.filter((item) => {
                                return item.id !== data.data.id;
                            }),
                            pagination: currenPost.pages[0].pagination,
                        },
                    ],
                };
                queryClient.setQueryData(nameQuery, newPost);
            }

            Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });
    const handleSubmit = () => {
        const postId = post.id;
        const parentId = 0;
        const content = textMessage.replace(/\n/g, '<br/>');
        if (content) {
            const payload = { postId, parentId, content };
            mutate(payload);
        }
    };

    const handleCreateReaction = () => {
        const postId = post.id;
        const icon = '<AiFillHeart />';
        const payload = { postId, icon };
        mutateReaction(payload);
    };
    const handleDeleteReaction = () => {
        mutateReactionDel(iconId);
    };

    const handleDeletePost = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa bài viết này?',
            showDenyButton: true,
            confirmButtonText: 'Chắc chắn',
            denyButtonText: `Hủy `,
        }).then((result) => {
            if (result.isConfirmed) {
                const postId = post.id;
                mutatePostDel(postId);
            }
        });
    };

    return (
        <div className="p-4 bg-base-200 rounded w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {!post.group.id ? (
                        <Link to={user.id == post.user_post.id ? '/profile' : `/profile/${post.user_post.id}`}>
                            <div className="avatar">
                                <div className="w-12 rounded-full">
                                    <img src={getImage(post.user_post.avatar)} />
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="relative">
                            <Link to={`/group/${post.group.id}`}>
                                <img className="w-10 h-10 rounded-full" src={getImage(post.group.avatar)} />
                            </Link>
                            <Link to={user.id == post.user_post.id ? '/profile' : `/profile/${post.user_post.id}`}>
                                <div className="absolute right-[-4px] bottom-[-4px] border border-primary rounded-full">
                                    <img className="w-6 h-6 rounded-full" src={getImage(post.user_post.avatar)} />
                                </div>
                            </Link>
                        </div>
                    )}

                    <div>
                        {post.group.id && (
                            <Link to={`/group/${post.group.id}`} className=" link link-hover">
                                <p className="font-medium">{post.group.name}</p>
                            </Link>
                        )}
                        <div className="text-sm space-x-2">
                            <Link
                                to={user.id == post.user_post.id ? '/profile' : `/profile/${post.user_post.id}`}
                                className="link link-hover"
                            >
                                <span>{post.user_post.name}</span>
                            </Link>
                            <span>·</span>
                            <span>{calculateCreatedTime(post.created_at)}</span>
                        </div>
                    </div>
                </div>

                {post.author_id == user.id && (
                    <div className="dropdown dropdown-left">
                        <label tabIndex={0}>
                            <div className="btn btn-ghost btn-sm">
                                <BiDotsVerticalRounded size={25} />
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <a
                                    onClick={() => {
                                        setVisibleActivePost(true);
                                    }}
                                >
                                    Chỉnh sửa
                                </a>
                            </li>
                            <li>
                                <a onClick={handleDeletePost}>Xóa</a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            <article className="prose lg:prose-xl mt-2" dangerouslySetInnerHTML={{ __html: post.html }}></article>

            <div className="mt-2 ">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(isShowFullImage ? post.images : [...post.images].splice(0, 6)).map((item, index) =>
                        getImage(item.src).includes('.mp4') || getImage(item.src).includes('.mov') ? (
                            <video
                                controls
                                key={index}
                                className="w-full h-[250px] object-cover aspect-square"
                                src={getImage(item.src)}
                            />
                        ) : (
                            <img
                                src={getImage(item.src)}
                                key={index}
                                className="w-full h-[250px] object-cover aspect-video"
                            />
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
                    ''
                )}
            </div>

            <div className="flex items-center gap-2 py-2 border-t">
                {isLiked ? (
                    <button className="btn btn-sm" onClick={handleDeleteReaction}>
                        <AiFillHeart size={23} />
                        <span>{post.count_reaction}</span>
                    </button>
                ) : (
                    <button className="btn btn-sm" onClick={handleCreateReaction}>
                        <AiOutlineHeart size={23} />
                        <span>{post.count_reaction}</span>
                    </button>
                )}
                <button className="btn btn-sm" onClick={() => inputRef?.current?.focus()}>
                    <BiCommentDetail size={20} />
                    <span>{post.count_comment}</span>
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
                            placeholder="Viết bình luận..."
                        ></textarea>

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
                        <button className="btn btn-primary text-base-100" onClick={handleSubmit} disabled={isPending}>
                            {isPending && <span className="loading loading-spinner"></span>}
                            Gửi
                        </button>
                    </div>
                </div>

                <h3>Bình luận</h3>
                <div className="space-y-2 mt-4">
                    {parentComments.length == 0 && <p>Không có bình luận</p>}
                    {(isShowFullComment ? parentComments : [...parentComments].splice(0, 5)).map((item, index) => (
                        <CardComment comment={item} key={item.id} post={post} nameQuery={nameQuery} />
                    ))}
                    {parentComments.length > 5 ? (
                        <button
                            onClick={() => setIsShowFullComment(!isShowFullComment)}
                            className="btn btn-sm md:btn-md btn-ghost mt-2"
                        >
                            {!isShowFullComment ? 'Xem thêm' : 'Thu gọn'}
                        </button>
                    ) : (
                        ''
                    )}
                </div>
            </div>
            {visibleActivePost && post && (
                <UpdatePostModal
                    onClose={() => setVisibleActivePost(false)}
                    post={post}
                    visible={visibleActivePost}
                    nameQuery={nameQuery}
                />
            )}
        </div>
    );
};

export default CardPost;
