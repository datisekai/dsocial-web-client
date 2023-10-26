import { BiHomeAlt2, BiMessageSquare, BiGroup } from 'react-icons/bi';
import { LiaUserFriendsSolid } from 'react-icons/lia';
import { CgProfile } from 'react-icons/cg';
const tabs = [
    {
        url: '/',
        title: 'Trang chủ',
        icon: BiHomeAlt2,
    },
    {
        url: '/friend',
        title: 'Bạn bè',
        icon: LiaUserFriendsSolid,
    },
    {
        url: '/message',
        title: 'Tin nhắn',
        icon: BiMessageSquare,
    },
    {
        url: '/group',
        title: 'Nhóm',
        icon: BiGroup,
    },
    {
        url: '/profile',
        title: 'Trang cá nhân',
        icon: CgProfile,
    },
];

export default tabs;
