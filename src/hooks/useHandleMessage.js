import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext } from 'react';
import MessageService from '../services/MessageService';
import { SocketContext } from '../contexts/SocketContext';
import { uploadServer } from '../utils/axiosClient';
import { useSelector } from 'react-redux';

const useHandleMessage = ({ receiveId }) => {
    const { user } = useSelector((state) => state.user);
    const { socket } = useContext(SocketContext);
    const queryClient = useQueryClient();

    const { mutate: sendText, isSuccess } = useMutation({
        mutationFn: MessageService.addMessage,
        onSuccess: ({ data: { data } }, variable) => {
            const oldMessages = queryClient.getQueryData(['message', receiveId]);

            const message = { ...data, user_send: user, created_at: Date.now() };

            queryClient.setQueryData(['message', receiveId], [...oldMessages, message]);

            const oldMyMessage = queryClient.getQueryData(['my-messages']) || [];

            queryClient.setQueryData(
                ['my-messages'],
                oldMyMessage.map((item) =>
                    item.user_send.id === data.receive_id.id ? { ...item, last_message: message } : item,
                ),
            );

            socket.current.emit('send-message', message);
        },
    });

    const { mutate: recallMessage } = useMutation({
        mutationFn: MessageService.recallMessage,
        onSuccess: (data, variable) => {
            const oldMessages = queryClient.getQueryData(['message', receiveId]);
            queryClient.setQueryData(
                ['message', receiveId],
                oldMessages.map((item) =>
                    item.id == variable ? { ...item, content: 'Tin nhắn đã được thu hồi', is_active: false } : item,
                ),
            );

            const oldMyMessage = queryClient.getQueryData(['my-messages']) || [];
            

            queryClient.setQueryData(
                ['my-messages'],
                oldMyMessage.map((item) =>
                    item.user_send.id == receiveId &&  item.last_message.id <= variable
                        ? {
                              ...item,
                              last_message: {
                                  ...item.last_message,
                                  is_active: false,
                                  content: 'Tin nhắn đã được thu hồi',
                              },
                          }
                        : item,
                ),
            );

            const payload = { receiveId, messageId: +variable, authorId: user.id };
            socket.current.emit('recall-message', payload);
        },
    });

    const { mutate: seenMessage } = useMutation({
        mutationFn: MessageService.seenMessage,
        onSuccess: (data, variable) => {
            const oldMessages = queryClient.getQueryData(['message', receiveId]);
            queryClient.setQueryData(
                ['message', receiveId],
                oldMessages.map((item) => (item.id <= variable ? { ...item, is_seen: true } : item)),
            );

            const oldMyMessage = queryClient.getQueryData(['my-messages']) || [];

            queryClient.setQueryData(
                ['my-messages'],
                oldMyMessage.map((item) =>
                    item.user_send.id == receiveId
                        ? {
                              ...item,
                              last_message: {
                                  ...item.last_message,
                                  is_seen: true,
                              },
                          }
                        : item,
                ),
            );

            const payload = { receiveId, messageId: +variable, authorId: user.id };
            socket.current.emit('seen-message', payload);
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

    const handleRecallMessage = (messageId) => {
        recallMessage(messageId);
    };

    const handleSeenMessage = (messageId) => {
        seenMessage(messageId);
    };

    return { handleSendText, handleSendImage, handleSendVideo, isSuccess, handleRecallMessage, handleSeenMessage };
};

export default useHandleMessage;
