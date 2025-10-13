import { combineReducers } from 'redux';
import auth from './auth/reducers';
import filtroPrincipal from './filtro-principal/reducers';
import geral from './geral/reducers';
import areaConhecimento from './cadastro-item/area-conhecimento/reducers';
import disciplina from './cadastro-item/disciplina/reducers';
import matriz from './cadastro-item/matriz/reducers';
import {
  itemPrincipalNovo as item,
  configuracaoItemNovo,
  elaboracaoItemNovo,
} from './cadastroItem-novo/itemNovo/reducers';

const rootReducerNovo = combineReducers({
  auth,
  geral,
  filtroPrincipal,
  areaConhecimento,
  matriz,
  disciplina,
  item,
  configuracaoItemNovo,
  elaboracaoItemNovo,
});

export default rootReducerNovo;
