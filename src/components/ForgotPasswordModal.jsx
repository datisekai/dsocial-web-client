import React from 'react';
import Modal from './Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validateSchema = Yup.object({
    email: Yup.string().email('Định dạng email chưa đúng.').required('Bạn chưa nhập email.'),
});
const ForgotPassword = () => {
    
    return (
        <Modal
            openElement={<span className="text-sm link link-hover mt-1">Quên mật khẩu?</span>}
            onSubmit={() => {
                console.log('called');
            }}
        >
            <h3 className="font-bold text-lg">Quên mật khẩu</h3>
            <Formik initialValues={{ email: '' }} validationSchema={validateSchema}>
                <div className='mt-4'>
                    <span className='font-medium'>Email</span>
                    <Field
                        placeholder="Nhập email"
                        type="text"
                        name="email"
                        className="input mt-1 input-bordered w-full"
                    />
                    <ErrorMessage name="email" component="div" className="text-error text-sm" />
                </div>
            </Formik>
        </Modal>
    );
};

export default ForgotPassword;
