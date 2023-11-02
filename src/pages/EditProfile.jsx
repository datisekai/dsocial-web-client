import React, { useState } from 'react';
import { FaRegAddressCard } from 'react-icons/fa';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const validateSchema = Yup.object({
    bio: Yup.string(),
    name: Yup.string().required('Vui lòng nhập tên.').max(50, 'Tên không quá 50 kí tự.'),
    otherName: Yup.string(),
    birthday: Yup.date().required('Vui lòng chọn ngày sinh nhật.'),
    address: Yup.string(),
});

const EditProfile = () => {
    const [visiblePassword, setVisiblePassword] = useState(false);
    const { user } = useSelector((state) => state.user);

    const handleSubmit = (values) => {
        console.log('submit', values);
    };
    return (
        <div>
            <Formik
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
                initialValues={{ bio: '', name: '', otherName: '', birthday: '', address: '' }}
                validationSchema={validateSchema}
            >
                {({ handleSubmit }) => (
                    <>
                        <div className="relative">
                            <img
                                className="w-full h-auto aspect-video md:aspect-auto md:h-[250px] object-cover "
                                src="https://images.unsplash.com/photo-1682685797661-9e0c87f59c60?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D"
                            />

                            <div className="absolute px-4 bottom-[-40px] left-0 right-0 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img
                                        className="rounded-full w-[80px] h-[80px] border-primary border-2"
                                        src="http://fakeimg.pl/50x50?font=lobster"
                                        alt=""
                                    />
                                    <div className="">
                                        <h1 className="font-bold text-primary">Thành Đạt</h1>
                                        <p className="text-[#828486]">(datisekai)</p>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-sm md:btn-md btn-primary"
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                        <div className="mt-[62px] px-4">
                            <div>
                                <h2 className="font-bold text-sm text-primary mb-1">Tiểu sử</h2>
                                <Field
                                    as="textarea"
                                    className="textarea textarea-bordered w-full"
                                    placeholder="Tiểu sử"
                                    name="bio"
                                ></Field>
                                <ErrorMessage name="bio" component="div" className="text-error text-sm" />
                            </div>

                            <div className="border-t mt-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-bold text-sm text-primary mb-1">Tên của bạn</p>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Type here"
                                        className="input input-bordered w-full max-w-xs"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-error text-sm" />
                                </div>

                                <div>
                                    <p className="font-bold text-sm text-primary mb-1">Biệt danh (tên gọi khác)</p>
                                    <Field
                                        type="text"
                                        placeholder="Type here"
                                        name="otherName"
                                        className="input input-bordered w-full max-w-xs"
                                    />
                                    <ErrorMessage name="otherName" component="div" className="text-error text-sm" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-primary mb-1">Ngày sinh nhật</p>
                                    <Field
                                        type="date"
                                        placeholder="Type here"
                                        className="input input-bordered w-full max-w-xs"
                                        name="birthday"
                                    />
                                    <ErrorMessage name="birthday" component="div" className="text-error text-sm" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-primary mb-1">Địa chỉ</p>
                                    <Field
                                        type="text"
                                        placeholder="Type here"
                                        name="address"
                                        className="input input-bordered w-full max-w-xs"
                                    />
                                    <ErrorMessage name="address" component="div" className="text-error text-sm" />
                                </div>
                            </div>

                            <div className="py-4 mt-4 border-t">
                                <button
                                    className="btn btn-ghost btn-sm md:btn-md"
                                    onClick={() => setVisiblePassword(true)}
                                >
                                    Thay đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </Formik>

            {visiblePassword && (
                <ChangePasswordModal visible={visiblePassword} onClose={() => setVisiblePassword(false)} />
            )}
        </div>
    );
};

export default EditProfile;
