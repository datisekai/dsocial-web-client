import React, { useMemo, useState } from 'react';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import getImage from '../utils/getImage';
import { GoPencil } from 'react-icons/go';
import { uploadServer } from '../utils/axiosClient';
import Swal from 'sweetalert2';
import GroupServices from '../services/GroupService';
import { Navigate, useNavigate } from 'react-router-dom';
const validateSchema = Yup.object({
    name: Yup.string().required('Vui lòng nhập tên.').max(50, 'Tên không quá 50 kí tự.'),
});
const CreateGroup = () => {
    const { user } = useSelector((state) => state.user);
    const [cover_image, setCover_Image] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null);
    const navigate = useNavigate();

    const previewImage = useMemo(() => {
        if (!cover_image) {
            return getImage(null);
        }

        return URL.createObjectURL(cover_image);
    }, [cover_image]);

    const previewAvatar = useMemo(() => {
        if (!avatarImage) {
            return 'https://dummyimage.com/50x50.gif';
        }

        return URL.createObjectURL(avatarImage);
    }, [avatarImage]);

    const { mutate, isPending } = useMutation({
        mutationFn: GroupServices.createGroup,
        onSuccess: (data) => {
            navigate(`/group/${data.data.id}`);
            // Swal.fire('Thành công!', data.message, 'success');
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });
    const handleSubmit = async (values) => {
        let coverImage = '';
        let avatar = '';
        //TODO
        if (cover_image) {
            const resultCoverImage = await uploadServer(cover_image);
            coverImage = resultCoverImage.data;
        }

        if (avatarImage) {
            const resultAvatar = await uploadServer(avatarImage);
            avatar = resultAvatar.data;
        }
        if (!cover_image) {
            return Swal.fire('Thất bại!', 'Vui lòng chọn ảnh bìa', 'error');
        }
        if (!avatarImage) {
            return Swal.fire('Thất bại!', 'Vui lòng chọn ảnh đại diện', 'error');
        }

        const payload = { ...values, coverImage, avatar };
        console.log('submit', payload);
        mutate(payload);
    };
    return (
        <div>
            <Formik
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
                initialValues={{
                    name: '',
                }}
                validationSchema={validateSchema}
            >
                {({ handleSubmit }) => (
                    <>
                        <div className="relative">
                            <div className="flex items-center justify-center">
                                <input
                                    type="file"
                                    className="absolute"
                                    onChange={(e) => setCover_Image(e.target.files[0])}
                                    accept="image/*"
                                />
                                <img
                                    className="w-full h-auto aspect-video md:aspect-auto md:h-[250px] object-cover "
                                    src={previewImage}
                                />
                            </div>

                            <div className="absolute px-4 bottom-[-40px] left-0 right-0 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <img
                                            className="rounded-full w-[80px] h-[80px] border-primary border-2"
                                            src={previewAvatar}
                                            alt=""
                                        />
                                        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
                                            <label
                                                htmlFor="avatar"
                                                className="cursor-pointer text-white p-1 rounded-full"
                                            >
                                                <GoPencil />
                                            </label>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="avatar"
                                            onChange={(e) => setAvatarImage(e.target.files[0])}
                                        />
                                    </div>
                                    <div className="">
                                        <h1 className="font-bold text-primary">Tên nhóm</h1>
                                        <p className="text-[#828486]">({user.name})</p>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-sm md:btn-md btn-primary"
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isPending}
                                >
                                    {isPending && <span className="loading loading-spinner"></span>}
                                    Tạo nhóm
                                </button>
                            </div>
                        </div>
                        <div className="mt-[62px] px-4">
                            <div className="border-t mt-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-bold text-sm text-primary mb-1">Tên nhóm</p>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Tên nhóm"
                                        className="input input-bordered w-full max-w-xs"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-error text-sm" />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Formik>
        </div>
    );
};

export default CreateGroup;
