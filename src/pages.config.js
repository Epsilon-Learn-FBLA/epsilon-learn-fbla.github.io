import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import LessonView from './pages/LessonView';
import Profile from './pages/Profile';
import QuizView from './pages/QuizView';
import Resources from './pages/Resources';
import VideoView from './pages/VideoView';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Calendar": Calendar,
    "Dashboard": Dashboard,
    "Home": Home,
    "LessonView": LessonView,
    "Profile": Profile,
    "QuizView": QuizView,
    "Resources": Resources,
    "VideoView": VideoView,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};