import React from 'react';

const Modal = ({ children, openElement, textSubmit, onSubmit }) => {
    return (
        <>
            <label htmlFor="my-modal">{openElement}</label>

            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal z-[1000] ">
                <div className="modal-box">
                    {children}
                    <div className="modal-action">
                        <div className="flex items-center gap-x-2">
                            <label htmlFor="my-modal" className="btn btn-neutral text-neutral-content">
                                Đóng
                            </label>
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
