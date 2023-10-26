import React from 'react';
import { Link } from 'react-router-dom';

const CardFriend = ({ avatar, name, id }) => {
    return (
        <Link to={`/profile?id=${id}`}>
            <div className="flex items-center gap-4">
                <div className="avatar ">
                    <div className="w-14 rounded-full">
                        <img src={avatar} />
                    </div>
                </div>
                <span className='hover:font-medium'>{name}</span> 
            </div>
        </Link>
    );
};

export default CardFriend;
