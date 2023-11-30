import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import ScreenSpinner from '../components/ScreenSpinner';

const FormLayout = ({ children }) => {
    const [token, setToken] = useLocalStorage('token', '');

    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token]);

    return (
        <>
            {token ? (
                <ScreenSpinner />
            ) : (
                <div className="flex min-h-screen flex-col md:flex-row">
                    <div className="flex-1 hidden md:flex bg-gradient-to-b relative from-primary to-primary-focus p-4 justify-center">
                        <div className="flex flex-col items-center mt-16">
                            <Link to={'/'}>
                                <div className="avatar">
                                    <div className="w-36 rounded">
                                        <img src="/logo.png" />
                                    </div>
                                </div>
                            </Link>
                            <h1 className="font-medium text-base-100 text-2xl">Sáng tạo + Kết nối = DSocial</h1>
                            <p className="text-base-100">#Creator #Connect #DSocial</p>
                            <div className="absolute bottom-0">
                                <img src="/mask.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="avatar block md:hidden">
                            <div className="w-36 rounded">
                                <img src="/logo.png" />
                            </div>
                        </div>
                        <div className="p-4 md:pl-20">
                            <div className="py-2">{children}</div>
                            {/* <div className="border-t py-2">
                                <button className="btn">
                                    <FcGoogle className="text-xl" /> Đăng nhập Google
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormLayout;
