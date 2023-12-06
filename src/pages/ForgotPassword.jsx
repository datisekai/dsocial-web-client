import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import useQueryParams from '../hooks/useQueryParams';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import UserServices from '../services/UserService';
import Swal from 'sweetalert2';
import SWAL_MESSAGE from '../utils/messages';

const validateSchema = Yup.object({
    password: Yup.string().required('Bạn chưa nhập mật khẩu.').min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
    confirm: Yup.string()
        .required('Bạn cần nhập lại mật khẩu.')
        .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp.'),
});

const ForgotPassword = () => {
    const query = useQueryParams();
    const navigate = useNavigate();
    const token = query.get('token');

    useEffect(() => {
        if (!token) {
            return navigate('/login');
        }
    }, [token]);

    const { mutate, isPending } = useMutation({
        mutationFn: UserServices.resetPassword,
        onSuccess: (data) => {
            Swal.fire('Thành công!', 'Đặt lại mật khẩu thành công, vui lòng đăng nhập!', 'success');
            navigate('/login');
        },
        onError: (error) => {
            Swal.fire('Lỗi!', SWAL_MESSAGE.internal, 'error');
        },
    });

    return (
        <div className="">
            <h1 className="text-primary text-2xl font-medium">Đặt lại mật khẩu</h1>
            <Formik
                initialValues={{ password: '', confirm: '' }}
                validationSchema={validateSchema}
                onSubmit={(values) => {
                    mutate({ password: values.password, token });
                }}
            >
                {({ values }) => (
                    <Form className="mt-4">
                        <div className="form-control w-full max-w-md">
                            <label className="label">
                                <span className="label-text font-medium">Mật khẩu mới</span>
                            </label>

                            <Field
                                placeholder="Nhập mật khẩu mới"
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
                                placeholder="Nhập xác nhận mật khẩu"
                                type="password"
                                name="confirm"
                                className="input input-bordered w-full max-w-md"
                            />
                            <ErrorMessage name="confirm" component="div" className="text-error text-sm" />
                        </div>

                        <button disabled={isPending} type="submit" className="btn btn-primary mt-4">
                            {isPending && <span className="loading loading-spinner"></span>}
                            Đổi mật khẩu
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ForgotPassword;
