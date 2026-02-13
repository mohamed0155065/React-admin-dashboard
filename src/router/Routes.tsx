import { lazy, ReactElement } from 'react';

// ================= Lazy Pages =================
const Home = lazy(() => import('../pages/Home/Home'));
const Groups = lazy(() => import('../pages/groups/Groups'));
const Contacts = lazy(() => import('../pages/contacts/Contacts'));
const Invoices = lazy(() => import('../pages/invoices/Invoices'));
const RegisterPage = lazy(() => import('../pages/profile/components/RegisterPage'));
const Calendar = lazy(() => import('../calender/Calender'));
const FAQ = lazy(() => import('../pages/faq/FAQ'));
const NotFound = lazy(() => import('../pages/not founded/NotFounded'));
const Bar = lazy(() => import('../pages/Charts/Bar'));
const Pie = lazy(() => import('../pages/Charts/Bie'));
const Line = lazy(() => import('../pages/Charts/Line'));

// ================= Route Type =================
interface AppRoute {
    path: string;
    element: ReactElement;
}

// ================= Routes =================
export const routes: AppRoute[] = [
    { path: '/', element: <Home /> },
    { path: '/groups', element: <Groups /> },
    { path: '/contacts', element: <Contacts /> },
    { path: '/invoices', element: <Invoices /> },
    { path: '/profile', element: <RegisterPage /> },
    { path: '/calendar', element: <Calendar /> },
    { path: '/bar', element: <Bar /> },
    { path: '/pie', element: <Pie /> },      // ✅ lowercase — matches SideNav path
    { path: '/line', element: <Line /> },
    { path: '/faq', element: <FAQ /> },
    { path: '*', element: <NotFound /> },
];
