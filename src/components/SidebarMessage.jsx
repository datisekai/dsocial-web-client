import React from 'react';
import { Link } from 'react-router-dom';

const SidebarMessage = () => {
    return (
        <div>
            <h1 className="text-title">Tin nhắn</h1>
            <div className="mt-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm tin nhắn"
                    className="input input-bordered input-sm w-full max-w-xs"
                />
            </div>
            <div className="mt-4">
                {[1, 2, 3, 4, 5].map((item, index) => (
                   <Link to={`/message/${item}`} key={index}>
                    <div key={index} className="flex py-2 items-center gap-2 cursor-pointer">
                        <div className="avatar online">
                            <div className="w-[50px] rounded-full">
                                <img src="https://dummyimage.com/40x40.gif" />
                            </div>
                        </div>
                        <div>
                            <h2 className="font-medium">Thành Đạt</h2>
                            <p>Tin nhắn gần nhất</p>
                        </div>
                    </div></Link>
                ))}
            </div>
        </div>
    );
};

export default SidebarMessage;
