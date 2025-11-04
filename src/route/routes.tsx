import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import NaoAutenticado from '~/pages/403';
import CadastrarItemNovo from '~/pages/itemNovo/cadastrar/cadastrarItemNovo';
import CadastrarItemNovoElaboracao from '~/pages/itemNovo/cadastrar/cadastrarItemNovoElaboracao';
import ListagemItens from '~/pages/listagemItens/listagemItens';
import type { RootState } from '~/redux';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  if (isLoading) return <div>Carregando...</div>;

  return isAuthenticated ? <>{children}</> : <Navigate to='/sem-acesso' />;
};

const RoutesConfig: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <PrivateRoute>
            <ListagemItens />
          </PrivateRoute>
        }
      />
      <Route path='/sem-acesso' element={<NaoAutenticado />} />
      <Route
        path='/criacao'
        element={
          <PrivateRoute>
            <CadastrarItemNovo />
          </PrivateRoute>
        }
      />
      <Route
        path='/listagem'
        element={
          <PrivateRoute>
            <ListagemItens />
          </PrivateRoute>
        }
      />
      <Route
        path='/elaboracao'
        element={
          <PrivateRoute>
            <CadastrarItemNovoElaboracao />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default RoutesConfig;
