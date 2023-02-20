import { DefaultOptionType } from 'antd/lib/select';
import produce from 'immer';
import { SelectValueType } from '~/domain/type/select';

import { SetItem, SetIdItem, typeSetItemAtual, typeSetIdItemAtual } from './actions';

export interface ItemProps {
  id: number;
  codigo: number;
  areaConhecimento: SelectValueType;
  disciplina: SelectValueType;
  matriz: SelectValueType;
  listaAreaConhecimentos: DefaultOptionType[];
  listaDisciplinas: DefaultOptionType[];
  listaMatriz: DefaultOptionType[];
}

const initialValues = {
  id: 0,
  codigo: 0,
  areaConhecimento: null,
  disciplina: null,
  matriz: null,
  modalidade: null,
  listaAreaConhecimentos: [],
  listaDisciplinas: [],
  listaMatriz: [],
};

export const idItemPrincipal = (state: ItemProps = initialValues, action: SetIdItem) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetIdItemAtual:
        draft.id = action.payload;
        break;
      default:
        break;
    }
  });
};

const itemPrincipal = (state: ItemProps = initialValues, action: SetItem) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetItemAtual:
        draft.id = action.payload.id;
        draft.codigo = action.payload.codigo;
        draft.areaConhecimento = action.payload.areaConhecimento;
        draft.disciplina = action.payload.disciplina;
        draft.matriz = action.payload.matriz;
        draft.listaAreaConhecimentos = action.payload.listaAreaConhecimentos;
        draft.listaDisciplinas = action.payload.listaDisciplinas;
        draft.listaMatriz = action.payload.listaMatriz;
        break;
      default:
        break;
    }
  });
};

export default itemPrincipal;
