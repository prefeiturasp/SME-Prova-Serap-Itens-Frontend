import { App as AppAntd } from 'antd';
import moment from 'moment';
import CadastrarItemNovo from './pages/itemNovo/cadastrar/cadastrarItemNovo';
import NotificationStorage from './components/lib/notification/index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ListarItemNovo from './pages/itemNovo/listar/listarItemNovo';
import FormularioContainerComponent from './components/cadastro-item-novo/FormularioContainerComponent/FormularioContainerComponent';
import CadastrarItemNovoElaboracao from './pages/itemNovo/cadastrar/cadastrarItemNovoElaboracao';

moment.locale('pt-br');

const App = () => (
  <AppAntd>
    <NotificationStorage />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListarItemNovo />} />

        <Route path="/itens/novo" element={<FormularioContainerComponent />}>
          <Route path="pagina1" element={<CadastrarItemNovo />} />
          <Route path="pagina2" element={<CadastrarItemNovoElaboracao />} />
        </Route>

        {/* <Route path="/itens/:id/editar" element={<FormularioContainer />}>
          <Route path="pagina1" element={<Pagina1 />} />
          <Route path="pagina2" element={<Pagina2 />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  </AppAntd>
);

export default App;
