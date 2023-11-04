import React, { useState } from 'react';
import getImage from '../../utils/getImage';
import calculateCreatedTime from '../../utils/calculateCreatedTime';
const CardPost = ({ post }) => {
    const [isShowFullImage, setIsShowFullImage] = useState(false);

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
        </div>
    );
};

export default CardPost;
