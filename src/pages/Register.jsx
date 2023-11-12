import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ForgotPasswordModal from '../components/Modal/ForgotPasswordModal';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import UserServices from '../services/UserService';
import Swal from 'sweetalert2';

const validateSchema = Yup.object({
    email: Yup.string().email('Định dạng email chưa đúng.').required('Bạn chưa nhập email.'),
    password: Yup.string().required('Bạn chưa nhập mật khẩu.').min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
    name: Yup.string().required('Bạn chưa nhập tên.'),
    confirm: Yup.string()
        .required('Bạn cần nhập lại mật khẩu.')
        .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp.'),
});
const Register = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: UserServices.register,
        onSuccess: (data) => {
            Swal.fire('Thành công!', 'Vui lòng kiểm tra email & xác nhận!', 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }

            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    console.log(isPending)

    const handleSubmit = (values) => {
        mutate(values);
    };

    return (
        <div className="">
            <h1 className="text-primary text-2xl font-medium">Đăng ký</h1>
            <Formik
                initialValues={{ email: '', password: '', name: '', confirm: '' }}
                validationSchema={validateSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="mt-4">
                        <div className="form-control w-full max-w-md">
                            <label className="label">
                                <span className="label-text font-medium">Tên của bạn</span>
                            </label>

                            <Field
                                placeholder="Nhập tên của bạn"
                                type="text"
                                name="name"
                                className="input input-bordered w-full max-w-md"
                            />
                            <ErrorMessage name="name" component="div" className="text-error text-sm" />
                        </div>
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
                        </div>
                        <div className="form-control w-full max-w-md mt-2">
                            <label className="label">
                                <span className="label-text font-medium">Xác nhận mật khẩu</span>
                            </label>

                            <Field
                                placeholder="Nhập lại mật khẩu"
                                type="password"
                                name="confirm"
                                className="input input-bordered w-full max-w-md"
                            />
                            <ErrorMessage name="confirm" component="div" className="text-error text-sm" />
                            <div className="flex justify-end">
                                <ForgotPasswordModal />
                            </div>
                        </div>

                        <div className="mt-2">
                            Bạn đã có tài khoản?{' '}
                            <Link to={'/login'}>
                                <button className="btn btn-ghost btn-sm text-primary">Đăng nhập</button>
                            </Link>
                        </div>

                        <button type="submit" disabled={isPending} className="btn btn-primary mt-4">
                            {isPending && <span className="loading loading-spinner"></span>}
                            Đăng ký
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Register;
