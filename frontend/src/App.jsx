import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './redux/Store';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar/Navbar';
import InCinemaPage from './pages/InCinemaPage/InCinemaPage';
import AuthPage from './pages/AuthPage/AuthPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import ChooseSessionPage from './pages/ChooseSessionPage/ChooseSessionPage';
import HallPage from './pages/HallPage/HallPage';
import SnacksListPage from './pages/SnacksListPage/SnacksListPage';
import WatchFilmsOnlinePage from './pages/WatchFilmsOnlinePage/WatchFilmsOnlinePage';
import FilmDetailsOnlinePage from './pages/FilmDetailsOnlinePage/FilmDetailsOnlinePage';
import AdminPanelPage from './pages/AdminPanelPage/AdminPanelPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute ';
import ActionsPage from './pages/ActionsPage/ActionsPage';
import FilmReviewsPage from './pages/FilmReviewsPage/FilmReviewsPage';
import AboutUsPage from './pages/AboutUsPage/AboutUsPage';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </Provider>
  );
};

const MainApp = () => {
  const user = useSelector(store => store.auth.user);

  const isAdmin = user?.roles?.includes("Admin");

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />

      {isAdmin ?
        <AdminPanelPage />
        :
        <Routes>
          <Route path='/' element={<InCinemaPage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/about-us' element={<AboutUsPage />} />
          <Route path='/my-profile' element={<UserProfilePage />} />
          <Route path='/:locationId/sessions' element={<ChooseSessionPage />} />
          <Route path='/:filmId/reviews' element={<FilmReviewsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/:locationId/sessions/:sessionId' element={<HallPage />} />
            <Route path='/:locationId/sessions/:sessionId/snacks' element={<SnacksListPage />} />
          </Route>

          <Route path='/watch-online' element={<WatchFilmsOnlinePage />} />
          <Route path='/watch-online/:filmId' element={<FilmDetailsOnlinePage />} />

          <Route path='/actions' element={<ActionsPage />} />
        </Routes>
      }
    </div>
  );
};

export default App;
