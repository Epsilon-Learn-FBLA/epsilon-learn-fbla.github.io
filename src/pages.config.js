import Home from './pages/Home';
import Resources from './pages/Resources';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';
import VideoView from './pages/VideoView';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Resources": Resources,
    "Dashboard": Dashboard,
    "Profile": Profile,
    "Calendar": Calendar,
    "LessonView": LessonView,
    "QuizView": QuizView,
    "VideoView": VideoView,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};