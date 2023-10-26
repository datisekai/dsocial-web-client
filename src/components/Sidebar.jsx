import React from 'react';
import { useSelector } from 'react-redux';

import { NavLink } from 'react-router-dom';
import tabs from '../data/tabs';

const Sidebar = () => {
    const { user } = useSelector((state) => state.user);

    return (
        <div className="">
            <div className="flex items-center gap-4">
                <div className="avatar ">
                    <div className="w-12 rounded-full">
                        <img src={user?.avatar} />
                    </div>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm trên DSocial"
                        className="input input-bordered input-sm w-full max-w-xs"
                    />
                </div>
            </div>

            <ul className="mt-4">
                {tabs.map((tab, index) => {
                    const ReactIcon = tab.icon;
                    return (
                        <NavLink key={index} to={tab.url}>
                            <li className="sidebar flex hover:font-medium cursor-pointer gap-x-4 items-center py-2">
                                <ReactIcon />
                                <span>{tab.title}</span>
                            </li>
                        </NavLink>
                    );
                })}
            </ul>
        </div>
    );
};

export default Sidebar;
