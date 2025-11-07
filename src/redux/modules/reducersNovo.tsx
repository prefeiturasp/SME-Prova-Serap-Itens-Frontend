import { combineReducers } from 'redux';
import { auth } from './auth/reducers';
import filtroPrincipal from './filtro-principal/reducers';
import geral from './geral/reducers';
import areaConhecimento from './cadastroItem-novo/area-conhecimento/reducers';
import disciplina from './cadastroItem-novo/disciplina/reducers';
import matriz from './cadastroItem-novo/matriz/reducers';
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
