import { combineReducers } from 'redux';
import auth from './auth/reducers';
import filtroPrincipal from './filtro-principal/reducers';
import geral from './geral/reducers';

const rootReducer = combineReducers({
  auth,
  geral,
  filtroPrincipal,
});

export default rootReducer;
