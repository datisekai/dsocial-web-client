import React from 'react';
import { Link } from 'react-router-dom';
import getImage from '../../utils/getImage';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const CardFriend = ({ avatar, name, id, isMessage, disableOnline  }) => {
    return (
        <Link to={isMessage ? `/message/${id}` : `/profile/${id}`} className=" link link-hover">
            <div className="flex items-center gap-4">
                <div className={`avatar ${!disableOnline ? 'online' : ''}`}>
                    <div className="w-14 rounded-full">
                        <LazyLoadImage effect='blur' src={getImage(avatar)} />
                    </div>
                </div>
                <span className="hover:font-medium">{name}</span>
            </div>
        </Link>
    );
};

export default CardFriend;
