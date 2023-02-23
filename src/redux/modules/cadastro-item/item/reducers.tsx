import { DefaultOptionType } from 'antd/lib/select';
import produce from 'immer';
import { SelectValueType } from '~/domain/type/select';

import {
  SetItem,
  SetIdItem,
  typeSetItemAtual,
  typeSetIdItemAtual,
  SetIdCompetencia,
  typeSetIdCompetencia,
  SetListaCompetencias,
  typeSetListaCompetencias,
  SetIdMatriz,
  typeSetIdMatrizAtual,
} from './actions';

export interface ItemProps {
  id: number;
  codigo: number;
  areaConhecimento: SelectValueType;
  disciplina: SelectValueType;
  matriz: SelectValueType;
  competencia: SelectValueType;
  listaAreaConhecimentos: DefaultOptionType[];
  listaDisciplinas: DefaultOptionType[];
  listaMatriz: DefaultOptionType[];
  listaCompetencias: DefaultOptionType[];
}

const initialValues = {
  id: 0,
  codigo: 0,
  areaConhecimento: null,
  disciplina: null,
  matriz: null,
  modalidade: null,
  competencia: null,
  listaAreaConhecimentos: [],
  listaDisciplinas: [],
  listaMatriz: [],
  listaCompetencias: [],
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

export const itemPrincipal = (state: ItemProps = initialValues, action: SetItem) => {
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

export const idMatriz = (state: ItemProps = initialValues, action: SetIdMatriz) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetIdMatrizAtual:
        draft.matriz = action.payload;
        break;
      default:
        break;
    }
  });
};

export const idCompetencia = (state: ItemProps = initialValues, action: SetIdCompetencia) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetIdCompetencia:
        draft.competencia = action.payload;
        break;
      default:
        break;
    }
  });
};

export const listaCompetencias = (
  state: ItemProps = initialValues,
  action: SetListaCompetencias,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetListaCompetencias:
        draft.listaCompetencias = action.payload;
        break;
      default:
        break;
    }
  });
};
