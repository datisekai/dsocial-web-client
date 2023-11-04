import config from '../config';

// Layouts
import { FormLayout, PublicLayout } from '../layouts';
import ConfirmEmail from '../pages/ConfirmEmail';
import DetailGroup from '../pages/DetailGroup';
import EditProfile from '../pages/EditProfile';
import ForgotPassword from '../pages/ForgotPassword';
import Friend from '../pages/Friend';
import Group from '../pages/Group';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Message from '../pages/Message';
import Profile from '../pages/Profile';
import Register from '../pages/Register';

// Public routes
const publicRoutes = [
    { path: config.routes.login, component: Login, layout: FormLayout },
    { path: config.routes.register, component: Register, layout: FormLayout },
    { path: config.routes.forgotPassword, component: ForgotPassword, layout: PublicLayout },
    { path: config.routes.confirmEmail, component: ConfirmEmail, layout: PublicLayout },
];

const privateRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.friend, component: Friend },
    { path: config.routes.message, component: Message },
    { path: config.routes.group, component: Group },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.editProfile, component: EditProfile },
    {
        path: config.routes.groupDetail,
        component: DetailGroup,
    },
];

export { privateRoutes, publicRoutes };
