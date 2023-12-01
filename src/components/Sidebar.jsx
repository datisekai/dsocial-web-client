import React, { useState } from 'react';

import { BiLogOutCircle } from 'react-icons/bi';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { NavLink, useNavigate } from 'react-router-dom';
import tabs from '../data/tabs';
import useUser from '../hooks/useUser';
import getImage from '../utils/getImage';
const Sidebar = () => {
    const { user, handleLogout } = useUser();

    const [searchText, setSearchText] = useState('');

    const navigate = useNavigate();

    return (
        <div className="">
            <div className="flex items-center gap-4">
                <div className="avatar ">
                    <div className="w-12 rounded-full">
                        <LazyLoadImage effect="blur" src={getImage(user?.avatar)} />
                    </div>
                </div>
                <div>
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm trên DSocial"
                        onKeyUp={(e) => {
                            if (e.code == 'Enter' && searchText.trim().length !== 0) {
                                navigate(`/search?query=${searchText}`);
                            }
                        }}
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
                <li
                    onClick={handleLogout}
                    className="sidebar flex hover:font-medium cursor-pointer gap-x-4 items-center py-2"
                >
                    <BiLogOutCircle />
                    <span>Đăng xuất</span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
