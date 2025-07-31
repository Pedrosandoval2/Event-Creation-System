import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import type { RouteConfig } from '../App';
import DashboardLayout from '@/pages/private/DashboardLayout';


interface Props {
    routes: RouteConfig[];
    typeRoutes?: 'private' | 'public';
}

export const RoutesPages: React.FC<Props> = ({ routes, typeRoutes }) => {

    return (
        <Router>
            <DashboardLayout isActive={typeRoutes === 'private'}>
                <Routes>
                    {
                        routes.map(({ path, component: Component }) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <Component />
                                }
                            />
                        ))
                    }
                    {typeRoutes && <Route
                        path='*'
                        element={<Navigate to={typeRoutes === 'private' ? '/dashboard' : '/login'} />}
                    />}
                </Routes>
            </DashboardLayout>
        </Router >
    )
}
