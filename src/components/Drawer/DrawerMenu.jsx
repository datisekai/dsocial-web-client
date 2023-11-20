import React from 'react';
import tabs from '../../data/tabs';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getImage from '../../utils/getImage';
import useUser from '../../hooks/useUser';
import { BiLogOutCircle } from 'react-icons/bi';
const DrawerMenu = ({ visible, onClose }) => {
    const { user, handleLogout } = useUser();

    const [searchText, setSearchText] = React.useState('');

    const navigate = useNavigate();
    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" onChange={() => {}} checked={visible} />

            <div className="drawer-side z-[100]">
                <div onClick={onClose} aria-label="close sidebar" className="drawer-overlay"></div>
                <div className="menu p-4 w-80 min-h-full bg-base-200 ">
                    <div className="flex items-center gap-4">
                        <div className="avatar ">
                            <div className="w-12 rounded-full">
                                <img src={getImage(user?.avatar)} />
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Tìm kiếm trên DSocial"
                                onKeyUp={(e) => {
                                    if (e.code == 'Enter') {
                                        navigate(`/search?query=${searchText}`);
                                    }
                                }}
                                className="input input-bordered input-sm w-full max-w-xs"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        {tabs.map((tab, index) => {
                            const ReactIcon = tab.icon;
                            return (
                                <NavLink key={index} to={tab.url}>
                                    <div className="flex drawer-menu px-4 space-x-4 justify-start cursor-pointer text-lg items-center py-4">
                                        <ReactIcon />
                                        <span>{tab.title}</span>
                                    </div>
                                </NavLink>
                            );
                        })}

                        <div
                            onClick={handleLogout}
                            className="flex drawer-menu px-4 space-x-4 justify-start cursor-pointer text-lg items-center py-4"
                        >
                            <BiLogOutCircle />
                            <span>Đăng xuất</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawerMenu;
