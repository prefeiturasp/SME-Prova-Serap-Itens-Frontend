import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NaoAutenticado from '~/pages/403';
import PagNotFound from '~/pages/404';
import Autenticar from '~/pages/autenticar';
import HomeDashboard from '~/pages/home-dashboard';
import MainContent from '~/pages/main-content';
import { AppState } from '../redux';

const RoutesConfig: React.FC = () => {
  const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <Routes>
          <Route
            path='/'
            element={
              <MainContent>
                <HomeDashboard />
              </MainContent>
            }
          />
          <Route path='*' element={<PagNotFound />} />
        </Routes>
      ) : (
        <>
          <Routes>
            <Route path='/:codigoValidador' element={<Autenticar />} />
            <Route path='*' element={<NaoAutenticado />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
};

export default RoutesConfig;
