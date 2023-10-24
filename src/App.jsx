import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import useAuth from './hooks/useAuth';
import { PublicLayout } from './layouts';
import { publicRoutes } from './routes';

function App() {
    useAuth();

    return (
        <Router>
            <div className="App" data-theme="mytheme">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = PublicLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
