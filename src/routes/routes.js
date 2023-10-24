import config from '../config';

// Layouts
import { PrivateLayout, PublicLayout, FormLayout } from '../layouts';
import ConfirmEmail from '../pages/ConfirmEmail';
import ForgotPassword from '../pages/ForgotPassword';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';

// Public routes
const publicRoutes = [
    { path: config.routes.login, component: Login, layout: FormLayout },
    { path: config.routes.register, component: Register, layout: FormLayout },
    { path: config.routes.forgotPassword, component: ForgotPassword, layout: FormLayout },
    { path: config.routes.confirmEmail, component: ConfirmEmail, layout: PublicLayout },
];

const privateRoutes = [
    { path: config.routes.home, component: Home },
]


export { privateRoutes, publicRoutes };
