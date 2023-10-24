import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import useAuth from './hooks/useAuth';
import { PrivateLayout, PublicLayout } from './layouts';
import { privateRoutes, publicRoutes } from './routes';
import { Fragment } from 'react';

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

                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = PrivateLayout;

                        if (route.layout) {
                            Layout = route.layout;
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
