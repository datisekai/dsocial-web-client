import React from 'react';
import { Link } from 'react-router-dom';
import getImage from '../../utils/getImage';

const CardFriend = ({ avatar, name, id }) => {
    return (
        <Link to={`/profile/${id}`} className=" link link-hover">
            <div className="flex items-center gap-4">
                <div className="avatar ">
                    <div className="w-14 rounded-full">
                        <img src={getImage(avatar)} />
                    </div>
                </div>
                <span className="hover:font-medium">{name}</span>
            </div>
        </Link>
    );
};

export default CardFriend;
