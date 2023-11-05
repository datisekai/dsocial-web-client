import React, { useState } from 'react';
import { kFormatter } from '../../utils/common';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import GroupServices from '../../services/GroupService';
import Swal from 'sweetalert2';

const CardGroup = ({ group, isJoin }) => {
    const [currentGroup, setCurrentGroup] = useState(null);
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: GroupServices.joinGroup,
        onSuccess: (data) => {
            const newCurrentGroups = { ...currentGroup, is_joined: data.data.is_joined };
            const currentAllGroupsJoined = queryClient.getQueryData(['allgroupsjoined']);
            const currentAllGroups = queryClient.getQueryData(['allgroups']);
            if (currentAllGroupsJoined) {
                const newDataAllGroupsJoined = {
                    success: currentAllGroupsJoined.success,
                    data: [...currentAllGroupsJoined.data, newCurrentGroups],
                    pagination: currentAllGroupsJoined.pagination,
                };
                queryClient.setQueryData(['allgroupsjoined'], newDataAllGroupsJoined);
                if (currentAllGroups) {
                    const newDataAllGroups = {
                        success: currentAllGroups.success,
                        data: currentAllGroups.data.map((item) => {
                            if (item.id === newCurrentGroups.id) {
                                return {
                                    ...item,
                                    is_joined: newCurrentGroups.is_joined,
                                };
                            }
                            return item;
                        }),
                        pagination: currentAllGroups.pagination,
                    };
                    queryClient.setQueryData(['allgroups'], newDataAllGroups);
                }
            }

            Swal.fire('Thành công!', 'Đã tham gia nhóm', 'success');
            setCurrentGroup(null);
        },
        onError: (error) => {
            if (error?.message) {
                return Swal.fire('Thất bại!', error.message, 'error');
            }
            Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau vài phút!', 'error');
        },
    });
    const handleSubmit = (values) => {
        setCurrentGroup(values);
        mutate({ groupId: values.id });
    };
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img className="w-[60px] h-[60px] rounded-full " src="https://dummyimage.com/200x200.gif" alt="" />
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
