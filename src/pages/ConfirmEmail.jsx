import { useQuery } from '@tanstack/react-query';
import React from 'react';
import UserServices from '../services/UserService';
import useQueryParams from '../hooks/useQueryParams';
import { Link } from 'react-router-dom';

const ConfirmEmail = () => {
    const query = useQueryParams();
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ['confirmEmail'],
        queryFn: () => UserServices.confirmEmail(query.get('token')),
    });

    return (
        <div>
            <h1 className="text-primary text-2xl font-medium">Xác nhận email</h1>
            <div className="mt-4 py-2">
                {isLoading && (
                    <>
                        <span className="loading loading-ring loading-lg"></span>
                        <p className="mt-2">Vui lòng chờ một chút....</p>
                    </>
                )}

                {isError && (
                    <div>
                        <div className="alert alert-error">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>Lỗi! {error.message || 'Xác thực thất bại, vui lòng liên hệ admin'}!</span>
                        </div>

                        <div className='mt-2'>
                            Vui lòng{' '}
                            <Link to={'/login'}>
                                <span className='text-primary link link-hover'>đăng nhập</span>
                            </Link>
                        </div>
                    </div>
                )}

                {isSuccess && (
                    <div className="alert alert-success">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>
                            Thành công! Vui lòng{' '}
                            <Link to={'/login'}>
                                <span className="link link-hover">đăng nhập</span>
                            </Link>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmEmail;
