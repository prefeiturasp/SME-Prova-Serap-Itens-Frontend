import { Provider } from 'react-redux';

import { App as AppAntd } from 'antd';
import moment from 'moment';
import { PersistGate } from 'redux-persist/integration/react';
import ItemCadastro from './pages/item/cadastrar/index';
import { persistor, store } from './redux';

import NotificationStorage from './components/lib/notification/index';

moment.locale('pt-br');

const App = () => (
  <AppAntd>
    <NotificationStorage />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ItemCadastro></ItemCadastro>
      </PersistGate>
    </Provider>
  </AppAntd>
);

export default App;
