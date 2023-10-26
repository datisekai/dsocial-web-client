import React from 'react';
import Modal from './Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import UserServices from '../services/UserService';
import Swal from 'sweetalert2';

const validateSchema = Yup.object({
    email: Yup.string().email('Định dạng email chưa đúng.').required('Bạn chưa nhập email.'),
});
const ForgotPassword = ({ visible = false, onClose }) => {
    const { mutate, isPending } = useMutation({
        mutationFn: UserServices.forgotPassword,
        onSuccess: (data) => {
            console.log(data);
            const message = data.data.message;
            Swal.fire('Thành công!', message, 'success');
        },
        onError: (error) => {
            const message = error.message;
            Swal.fire('Lỗi!', message, 'error');
        },
    });

    return (
        <>
            <input type="checkbox" id="my-modal" className="modal-toggle" onChange={() => {}} checked={visible} />
            <div className="modal z-[1000] ">
                <div className="modal-box">
                    <Formik
                        onSubmit={(values) => {
                            mutate(values.email);
                        }}
                        initialValues={{ email: '' }}
                        validationSchema={validateSchema}
                    >
                        {({ handleSubmit }) => (
                            <>
                                <h3 className="font-bold text-lg">Quên mật khẩu</h3>
                                <div className="mt-4">
                                    <span className="font-medium">Email</span>
                                    <Field
                                        placeholder="Nhập email"
                                        type="text"
                                        name="email"
                                        className="input mt-1 input-bordered w-full"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-error text-sm" />
                                </div>
                                <div className="modal-action">
                                    <div className="flex items-center gap-x-2">
                                        <div onClick={onClose} className="btn btn-neutral text-neutral-content">
                                            Đóng
                                        </div>
                                        <button
                                            disabled={isPending}
                                            onClick={handleSubmit}
                                            className="btn btn-primary text-primary-content"
                                        >
                                            {isPending && <span className="loading loading-spinner"></span>} Thực hiện
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
