import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

const validateSchema = Yup.object({
    html: Yup.string().required('Bạn cần phải nhập nội dung.'),
});
const UpdatePostModal = ({ post, onClose, visible }) => {
    const { isPending } = useMutation();
    const inputRef = React.useRef(null);

    return (
        <>
            <input type="checkbox" id="my-modal" className="modal-toggle" onChange={() => {}} checked={visible} />
            <div className="modal z-[1000] ">
                <div className="modal-box">
                    <Formik
                        onSubmit={(values) => {
                            console.log(values);
                        }}
                        initialValues={post}
                        validationSchema={validateSchema}
                    >
                        {({ handleSubmit, values, setFieldValue }) => (
                            <>
                                <h3 className="font-bold text-lg text-primary">Cập nhật bài viết</h3>
                                <div className="mt-2 bg-base-200 rounded">
                                    <div className="bg-base-100 rounded">
                                        <Field
                                            as="textarea"
                                            ref={inputRef}
                                            name="html"
                                            className="textarea w-full textarea-bordered outline-none rounded"
                                            placeholder="Bạn đang nghĩ gì thế?"
                                        ></Field>
                                        <ErrorMessage name="html" component="div" className="text-error text-sm" />
                                    </div>
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

export default UpdatePostModal;
