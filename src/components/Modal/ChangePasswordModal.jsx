import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, Formik } from 'formik';
import React from 'react';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import ProfileServices from '../../services/ProfileService';

const validateSchema = Yup.object({
    oldPassword: Yup.string().required('Vui lòng nhập mật khẩu cũ.'),
    newPassword: Yup.string().required('Vui lòng nhập mật khẩu mới.'),
    confirm: Yup.string()
        .required('Bạn cần nhập lại mật khẩu.')
        .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp.'),
});
const ChangePasswordModal = ({ visible = false, onClose }) => {
    const { mutate, isPending } = useMutation({
        mutationFn: ProfileServices.changePassword,
        onSuccess: (data) => {
            Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    const handleChangePassword = (values) => {
        mutate(values);
    };

    return (
        <>
            <input type="checkbox" id="my-modal" className="modal-toggle" onChange={() => {}} checked={visible} />
            <div className="modal z-[1000] ">
                <div className="modal-box">
                    <Formik
                        onSubmit={(values) => {
                            handleChangePassword(values);
                        }}
                        initialValues={{ oldPassword: '', newPassword: '', confirm: '' }}
                        validationSchema={validateSchema}
                    >
                        {({ handleSubmit }) => (
                            <>
                                <h3 className="font-bold text-lg text-primary">Thay đổi mật khẩu</h3>
                                <div className="mt-4">
                                    <span className="font-medium">Mật khẩu cũ</span>
                                    <Field
                                        placeholder="Mật khẩu cũ"
                                        type="text"
                                        name="oldPassword"
                                        className="input mt-1 input-bordered w-full"
                                    />
                                    <ErrorMessage name="oldPassword" component="div" className="text-error text-sm" />
                                </div>
                                <div className="mt-4">
                                    <span className="font-medium">Mật khẩu mới</span>
                                    <Field
                                        placeholder="Mật khẩu mới"
                                        type="text"
                                        name="newPassword"
                                        className="input mt-1 input-bordered w-full"
                                    />
                                    <ErrorMessage name="newPassword" component="div" className="text-error text-sm" />
                                </div>
                                <div className="mt-4">
                                    <span className="font-medium">Nhập lại mật khẩu mới</span>
                                    <Field
                                        placeholder="Mật khẩu mới"
                                        type="text"
                                        name="confirm"
                                        className="input mt-1 input-bordered w-full"
                                    />
                                    <ErrorMessage name="confirm" component="div" className="text-error text-sm" />
                                </div>
                                <div className="modal-action">
                                    <div className="flex items-center gap-x-2">
                                        <div onClick={onClose} className="btn btn-neutral text-neutral-content">
                                            Đóng
                                        </div>
                                        <button
                                            disabled={isPending}
                                            type="button"
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

export default ChangePasswordModal;
