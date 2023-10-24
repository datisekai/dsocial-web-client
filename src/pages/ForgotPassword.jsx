import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import useQueryParams from '../hooks/useQueryParams';
import { useNavigate } from 'react-router-dom';

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

    return (
        <div className="">
            <h1 className="text-primary text-2xl font-medium">Đặt lại mật khẩu</h1>
            <Formik
                initialValues={{ password: '', confirm: '' }}
                validationSchema={validateSchema}
                onSubmit={(values) => {}}
            >
                {({ values }) => (
                    <Form className="mt-4">
                        <div className="form-control w-full max-w-md">
                            <label className="label">
                                <span className="label-text font-medium">Mật khẩu mới</span>
                            </label>

                            <Field
                                placeholder="Nhập mật khẩu mới"
                                type="text"
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
                                type="text"
                                name="confirm"
                                className="input input-bordered w-full max-w-md"
                            />
                            <ErrorMessage name="confirm" component="div" className="text-error text-sm" />
                        </div>

                        <button type="submit" className="btn btn-primary mt-4">
                            Đổi mật khẩu
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ForgotPassword;
