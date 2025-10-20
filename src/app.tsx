import { Provider } from 'react-redux';

import { App as ConfigProvider } from 'antd';
import moment from 'moment';
import { store } from './redux';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesConfig from './route/routes';
 //import GlobalStyle from './styles/global';

moment.locale('pt-br');

const App = () => (
  <Provider store={store}>
    <ConfigProvider>
      <Router>
        <RoutesConfig />
      </Router>
    </ConfigProvider>
  </Provider>
);

export default App;
