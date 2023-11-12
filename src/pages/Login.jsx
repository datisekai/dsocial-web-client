import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ForgotPasswordModal from '../components/Modal/ForgotPasswordModal';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useLocalStorage } from 'usehooks-ts';
import UserServices from '../services/UserService';

const validateSchema = Yup.object({
    email: Yup.string().email('Định dạng email chưa đúng.').required('Bạn chưa nhập email.'),
    password: Yup.string().required('Bạn chưa nhập mật khẩu.').min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
});
const Login = () => {
    const [token, setToken] = useLocalStorage('token', true);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: UserServices.login,
        onSuccess: (data) => {
            Swal.fire('Thành công!', 'Chào mừng bạn đến với DSocial', 'success');
            setToken(data.data.token);
            navigate('/');
            console.log(data.data.token);
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }

            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const handleSubmit = (values) => {
        mutate(values);
    };

    return (
        <div className="">
            <h1 className="text-primary text-2xl font-medium">Đăng nhập</h1>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validateSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="mt-4">
                        <div className="form-control w-full max-w-md">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>

                            <Field
                                placeholder="Nhập email"
                                type="text"
                                name="email"
                                className="input input-bordered w-full max-w-md"
                            />
                            <ErrorMessage name="email" component="div" className="text-error text-sm" />
                        </div>
                        <div className="form-control w-full max-w-md mt-2">
                            <label className="label">
                                <span className="label-text font-medium">Mật khẩu</span>
                            </label>

                            <Field
                                placeholder="Nhập mật khẩu"
                                type="password"
                                name="password"
                                className="input input-bordered w-full max-w-md"
                            />
                            <ErrorMessage name="password" component="div" className="text-error text-sm" />
                            <div className="flex justify-end">
                                <span onClick={() => setVisible(true)} className="text-sm link link-hover mt-1">
                                    Quên mật khẩu?
                                </span>
                            </div>
                        </div>

                        <div className="mt-2">
                            Bạn chưa có tài khoản?{' '}
                            <Link to={'/register'}>
                                <div className="btn btn-ghost btn-sm text-primary">Đăng ký</div>
                            </Link>
                        </div>

                        <button type="submit" disabled={isPending} className="btn btn-primary mt-4">
                            {isPending && <span className="loading loading-spinner"></span>}
                            Đăng nhập
                        </button>
                    </Form>
                )}
            </Formik>
            {visible && <ForgotPasswordModal visible={visible} onClose={() => setVisible(false)} />}
        </div>
    );
};

export default Login;
