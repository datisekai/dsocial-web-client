import { useMutation } from '@tanstack/react-query';
import React, { useContext } from 'react';
import MessageService from '../services/MessageService';
import { SocketContext } from '../contexts/SocketContext';
import { uploadServer } from '../utils/axiosClient';

const useHandleMessage = ({ receiveId }) => {
    const { socket } = useContext(SocketContext);

    const { mutate: sendText, isSuccess } = useMutation({
        mutationFn: MessageService.addMessage,
        onSuccess: ({ data: { data } }, variable) => {
            console.log('data', data);
            console.log('variable', variable);
        },
    });
    const handleSendText = (textMessage) => {
        if (!receiveId || !textMessage) return;

        const payload = {
            content: textMessage,
            receiveId,
            type: 'text',
        };

        sendText(payload);
    };

    const handleSendImage = async (file) => {
        if (!receiveId || !file) return;

        const result = await uploadServer(file);

        const payload = {
            content: result.data,
            receiveId,
            type: 'image',
        };
        sendText(payload);
    };

    const handleSendVideo = async (file) => {
        if (!receiveId || !file) return;

        const result = await uploadServer(file);

        const payload = {
            content: result.data,
            receiveId,
            type: 'video',
        };
        sendText(payload);
    };

    return { handleSendText, handleSendImage, handleSendVideo, isSuccess };
};

export default useHandleMessage;
