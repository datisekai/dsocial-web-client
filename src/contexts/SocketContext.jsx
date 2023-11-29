import React, { createContext } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const SocketContext = createContext(undefined);

const SocketContextProvider = ({ children }) => {
    const [userActives, setUserActives] = React.useState([]);
    const socket = React.useRef(null);
    const { user, friends } = useSelector((state) => state.user);

    React.useEffect(() => {
        console.log('called socket provider');
        socket.current = io(import.meta.env.VITE_APP_SOCKET_URL);

        socket.current.emit('add-user-active', user);
        socket.current.on('get-user-active', (users) => {
            console.log('userActives', users);
            setUserActives(users.filter((item) => item.id !== user.id));
        });
    }, []);

    React.useEffect(() => {
        if (!('Notification' in window)) {
            console.error('This browser does not support notifications.');
        } else if (Notification.permission === 'granted') {
            console.log('Notification permission has been granted.');
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Notification permission has been granted.');
                } else {
                    console.error('Notification permission has been denied.');
                }
            });
        }
    }, []);

    return (
        <SocketContext.Provider
            value={{
                socket,
                userActives,
                setUserActives,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContextProvider;
