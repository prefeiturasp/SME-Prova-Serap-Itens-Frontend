import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PagNotFound from '~/pages/404';
import HomeDashboard from '~/pages/home-dashboard';
import HomeCadastrar from '~/pages/item/cadastrar';
import MainContent from '~/pages/main-content';

const RoutesConfig: React.FC = () => {
 // const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      {/* {isAuthenticated ? ( */}
        <Routes>
          <Route
            path='/'
            element={
              <MainContent>
                <HomeDashboard />
              
                <HomeCadastrar/>
              </MainContent>
            }
          />
          <Route path='*' element={<PagNotFound />} />
        </Routes>
      {/* // ) : (
      //   <>
      //     <Routes>
      //       <Route path='/:codigoValidador' element={<Autenticar />} />
      //       <Route path='*' element={<NaoAutenticado />} />
      //     </Routes>
      //   </>
      // )} */}
    </BrowserRouter>
  );
};

export default RoutesConfig;
