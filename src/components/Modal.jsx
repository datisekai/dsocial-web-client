import React from 'react';

const Modal = ({ children, textSubmit, visible = false, onClose, onSubmit }) => {
    return (
        <>
            <input type="checkbox" id="my-modal" className="modal-toggle" checked={visible} onChange={() => {}} />
            <div className="modal z-[1000] ">
                <div className="modal-box">
                    {children}
                    <div className="modal-action">
                        <div className="flex items-center gap-x-2">
                            <div onClick={onClose} className="btn btn-neutral text-neutral-content">
                                Đóng
                            </div>
                            <button onClick={onSubmit} className="btn btn-primary text-primary-content">
                                {textSubmit || 'Thực hiện'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
