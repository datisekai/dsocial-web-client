import React, { useState } from 'react';
import { kFormatter } from '../../utils/common';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import GroupServices from '../../services/GroupService';
import getImage from '../../utils/getImage';
import Swal from 'sweetalert2';

const CardGroup = ({ group, isJoin, nameQuery }) => {
    const [currentGroup, setCurrentGroup] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: GroupServices.joinGroup,
        onSuccess: (data) => {
            const newCurrentGroups = { ...currentGroup, is_joined: data.data.is_joined };
            updateStateGroupJoined(data, newCurrentGroups);
            updateStateGroup(data, newCurrentGroups);
            setCurrentGroup(null);
            navigate(`/group/${newCurrentGroups.id}`);
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });
    const updateStateGroupJoined = (data, newCurrentGroups) => {
        const oldData = queryClient.getQueryData(['joinGroup', undefined]);
        const pages = oldData.pages.map((page) => {
            const { data } = page;
            const currentGroup = data.find((item) => item.id == newCurrentGroups.id);
            if (currentGroup) {
                return {
                    ...page,
                    data: [newCurrentGroups, ...data],
                };
            }
            return page;
        });

        queryClient.setQueryData(nameQuery, { ...oldData, pages });
    };

    const updateStateGroup = (data, newCurrentGroups) => {
        const oldData = queryClient.getQueryData(nameQuery);
        const pages = oldData.pages.map((page) => {
            const { data } = page;
            const currentGroup = data.find((item) => item.id == newCurrentGroups.id);
            if (currentGroup) {
                return {
                    ...page,
                    data: data.map((item) => {
                        if (item.id === postId) {
                            return {
                                ...item,
                                is_joined: newCurrentGroups.is_joined,
                            };
                        }
                        return item;
                    }),
                };
            }
            return page;
        });

        queryClient.setQueryData(nameQuery, { ...oldData, pages });
    };

    const handleSubmit = (values) => {
        setCurrentGroup(values);
        mutate({ groupId: values.id });
    };
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img className="w-[60px] h-[60px] rounded-full " src={getImage(group.avatar)} alt="" />
                <div>
                    <h2 className="text-title">{group.name}</h2>
                    <p>{kFormatter(group.users_joined.length)} thành viên</p>
                </div>
            </div>

            {!isJoin && (
                <button
                    disabled={isPending}
                    className="btn btn-primary btn-sm md:btn-md"
                    onClick={() => handleSubmit(group)}
                >
                    {isPending && <span className="loading loading-spinner"></span>}
                    Tham gia
                </button>
            )}
            {isJoin && (
                <Link to={`/group/${group.id}`}>
                    <button className="btn btn-ghost btn-sm md:btn-md">Xem thông tin</button>
                </Link>
            )}
        </div>
    );
};

export default CardGroup;
