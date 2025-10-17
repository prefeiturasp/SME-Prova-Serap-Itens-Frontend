import { Provider } from 'react-redux';

import { App as AppAntd } from 'antd';
import moment from 'moment';
import { PersistGate } from 'redux-persist/integration/react';
 //import ItemCadastro from './pages/item/cadastrar/index';
import CadastrarItemNovo from './pages/itemNovo/cadastrar/cadastrarItemNovo';
import { persistor, store } from './redux';

import NotificationStorage from './components/lib/notification/index';
import { BrowserRouter } from 'react-router-dom';
import CadastrarItemNovoElaboracao from './pages/itemNovo/cadastrar/cadastrarItemNovoElaboracao';
 //import GlobalStyle from './styles/global';

moment.locale('pt-br');

const App = () => (
  <AppAntd>
    <NotificationStorage />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <GlobalStyle /> 
        <ItemCadastro /> */}
        <BrowserRouter>
          {/* <----Primeira pagina */}
          <CadastrarItemNovo /> 
          {/*<----Segunda pagina */}
          {/* <CadastrarItemNovoElaboracao /> */}
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </AppAntd>
);

export default App;
