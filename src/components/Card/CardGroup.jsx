import React from 'react';
import { kFormatter } from '../../utils/common';
import { Link } from 'react-router-dom';

const CardGroup = ({ group, isJoin }) => {
    return (
        <div key={group.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img className='w-[60px] h-[60px] rounded-full ' src="https://dummyimage.com/200x200.gif" alt="" />
                <div>
                    <h2 className="text-title">{group.name}</h2>
                    <p>{kFormatter(group.members)} thành viên</p>
                </div>
            </div>

            {isJoin && <button className="btn btn-primary btn-sm md:btn-md">Tham gia</button>}
            {!isJoin && <Link to={`/group/${group.id}`}><button className="btn btn-ghost btn-sm md:btn-md">Xem thông tin</button></Link>}
        </div>
    );
};

export default CardGroup;
