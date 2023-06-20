import { combineReducers } from 'redux';
import auth from './auth/reducers';
import filtroPrincipal from './filtro-principal/reducers';
import geral from './geral/reducers';
import areaConhecimento from './cadastro-item/area-conhecimento/reducers';
import disciplina from './cadastro-item/disciplina/reducers';
import matriz from './cadastro-item/matriz/reducers';
import {
  itemPrincipal as item,
  configuracaoItem,
  componentesItem,
  elaboracaoItem,
} from './cadastro-item/item/reducers';

const rootReducer = combineReducers({
  auth,
  geral,
  filtroPrincipal,
  areaConhecimento,
  matriz,
  disciplina,
  item,
  configuracaoItem,
  componentesItem,
  elaboracaoItem,
});

export default rootReducer;
