import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CadastrarItemNovo from '~/pages/itemNovo/cadastrar/cadastrarItemNovo';
import CadastrarItemNovoElaboracao from '~/pages/itemNovo/cadastrar/cadastrarItemNovoElaboracao';
import ListagemItens from '~/pages/listagemItens/listagemItens';

const RoutesConfig: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<CadastrarItemNovo />} />

      <Route path='/criacao' element={<CadastrarItemNovo />} />
      <Route path='/listagem' element={<ListagemItens />} />
      <Route path='/elaboracao' element={<CadastrarItemNovoElaboracao />} />
    </Routes>
  );
};

export default RoutesConfig;
