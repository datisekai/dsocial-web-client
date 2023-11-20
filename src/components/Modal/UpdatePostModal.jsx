import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import PostServices from '../../services/PostService';
import Swal from 'sweetalert2';

const validateSchema = Yup.object({
    html: Yup.string().required('Bạn cần phải nhập nội dung.'),
});
const UpdatePostModal = ({ post, onClose, visible, nameQuery }) => {
    const inputRef = React.useRef(null);
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: PostServices.updatePost,
        onSuccess: (data) => {
            const currenPost = queryClient.getQueryData(nameQuery);
            if (currenPost) {
                console.log(data.data);
                const newPost = {
                    pageParams: currenPost.pageParams,
                    pages: [
                        {
                            success: currenPost.pages[0].success,
                            data: currenPost.pages[0].data.map((item) => {
                                if (item.id === data.data.id) {
                                    return {
                                        ...item,
                                        html: data.data.html,
                                    };
                                }
                                return item;
                            }),
                            pagination: currenPost.pages[0].pagination,
                        },
                    ],
                };
                queryClient.setQueryData(nameQuery, newPost);
                console.log(currenPost.data, data.data);
            }
            Swal.fire('Thành công!', data.message, 'success');
            onClose();
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });

    return (
        <>
            <input type="checkbox" id="my-modal" className="modal-toggle" onChange={() => {}} checked={visible} />
            <div className="modal z-[1000] ">
                <div className="modal-box">
                    <Formik
                        onSubmit={(values) => {
                            const payload = {
                                id: values.id,
                                html: values.html.replace(/\n/g, '<br/>'),
                                images: values.images,
                            };
                            mutate(payload);
                        }}
                        initialValues={{ ...post, html: post.html.replace('<br/>', '\n') }}
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
                                            placeholder="Sửa bài viết"
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
