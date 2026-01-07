import Home from './pages/Home';
import Resources from './pages/Resources';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Resources": Resources,
    "Dashboard": Dashboard,
    "Profile": Profile,
    "Calendar": Calendar,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};