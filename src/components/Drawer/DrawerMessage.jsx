import React from 'react';
import { Link } from 'react-router-dom';

const DrawMessage = ({ visible, onClose }) => {
    return (
        <div className="drawer drawer-end">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" onChange={() => {}} checked={visible} />

            <div className="drawer-side z-[100]">
                <div onClick={onClose} aria-label="close sidebar" className="drawer-overlay"></div>
                <div className="menu p-4 z-50 w-80 min-h-full bg-base-200 ">
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
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrawMessage;
