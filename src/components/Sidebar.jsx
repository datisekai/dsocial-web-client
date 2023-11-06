import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NavLink, useNavigate } from 'react-router-dom';
import tabs from '../data/tabs';
import { BiLogOutCircle } from 'react-icons/bi';
import { removeTokenAndUser } from '../redux/slices/userSlice';

const Sidebar = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(removeTokenAndUser())
        navigate('/login')
    }
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
                <li onClick={handleLogout} className="sidebar flex hover:font-medium cursor-pointer gap-x-4 items-center py-2">
                    <BiLogOutCircle />
                    <span>Đăng xuất</span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
