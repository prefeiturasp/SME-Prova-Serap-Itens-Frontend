import { Provider } from 'react-redux';

import moment from 'moment';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux';
import RoutesConfig from './route/routes';
import ItemCadastro from './pages/item/cadastrar/index';

moment.locale('pt-br');

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    {/* { <RoutesConfig /> } */}
    <HeaderTitle></HeaderTitle>
  <ItemCadastro></ItemCadastro>
    </PersistGate>
  </Provider>
);

export default App;
