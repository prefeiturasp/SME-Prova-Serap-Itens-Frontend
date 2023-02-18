import { DefaultOptionType } from 'antd/lib/select';
import produce from 'immer';
import { SelectValueType } from '~/domain/type/select';

import { SetItem, typeSetFiltroAtual } from './actions';

export interface ItemProps {
  id: number;
  codigo: string;
  areaConhecimento: SelectValueType;
  disciplina: SelectValueType;
  matriz: SelectValueType;
  listaAreaConhecimentos: DefaultOptionType[];
  listaDisciplinas: DefaultOptionType[];
  listaMatriz: DefaultOptionType[];
}

const initialValues = {
  id: 0,
  codigo: '',
  areaConhecimento: null,
  disciplina: null,
  matriz: null,
  modalidade: null,
  listaAreaConhecimentos: [],
  listaDisciplinas: [],
  listaMatriz: [],
};

const itemPrincipal = (state: ItemProps = initialValues, action: SetItem) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetFiltroAtual:
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
