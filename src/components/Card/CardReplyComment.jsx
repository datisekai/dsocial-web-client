import React, { useState } from 'react';
import { BsArrowReturnRight } from 'react-icons/bs';
import getImage from '../../utils/getImage';

const CardReplyComment = ({ comment }) => {
    const [showReply, setShowReply] = useState([]);

    console.log(comment);

    const getChildrenComment = (commentId) => {
        if (!comment.comments) return [];
        return comment.comments.filter((item) => item.parent_id == commentId);
    };

    return (
        <div>
            {' '}
            <div className="flex gap-2 py-2">
                <img src={getImage(comment.user_comment.avatar)} className="w-[40px] h-[40px] rounded-full" alt="" />
                <div className="">
                    <h4 className="font-medium">{comment.user_comment.name || comment.user_comment.other_name}</h4>
                    <p>{comment.content}</p>
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
