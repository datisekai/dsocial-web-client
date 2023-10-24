import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import ScreenSpinner from '../components/ScreenSpinner';

const PrivateLayout = ({ children }) => {
    const [token, setToken] = useLocalStorage('token', '');
    const { user } = useSelector((state) => state.user);
    // const user = null
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, []);

    return (
        <>
            {!token || !user ? (
                <ScreenSpinner />
            ) : (
                <div className="min-h-screen max-h-screen">
                    <h1>Private layout</h1>
                    <div>{children}</div>
                </div>
            )}
        </>
    );
};

export default PrivateLayout;
