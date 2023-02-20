import { ItemProps } from './reducers';
import { DefaultOptionType } from 'antd/lib/select';

export const typeSetItemAtual = '@itemPrincipal/setItemAtual';
export const typeSetIdItemAtual = '@itemPrincipal/setIdItemAtual';
export const typeSetIdMatrizAtual = '@itemPrincipal/setIdMatrizAtual';
export const typeSetIdCompetencia = '@itemPrincipal/setIdCompetenciaAtual';
export const typeSetListaCompetencias = '@itemPrincipal/setListaCompetencias';

export interface SetItem {
  type: typeof typeSetItemAtual;
  payload: ItemProps;
}

export interface SetIdItem {
  type: typeof typeSetIdItemAtual;
  payload: number;
}

export interface SetIdMatriz {
  type: typeof typeSetIdMatrizAtual;
  payload: number;
}

export interface SetIdCompetencia {
  type: typeof typeSetIdCompetencia;
  payload: number;
}

export interface SetListaCompetencias {
  type: typeof typeSetListaCompetencias;
  payload: DefaultOptionType[];
}

export const setItem = (payload: ItemProps): SetItem => {
  return {
    type: typeSetItemAtual,
    payload,
  };
};

export const setIdItem = (payload: number): SetIdItem => {
  return {
    type: typeSetIdItemAtual,
    payload,
  };
};

export const setIdMatriz = (payload: number): SetIdMatriz => {
  return {
    type: typeSetIdMatrizAtual,
    payload,
  };
};

export const setIdCompetencia = (payload: number): SetIdCompetencia => {
  return {
    type: typeSetIdCompetencia,
    payload,
  };
};

export const setListaCompetencias = (payload: DefaultOptionType[]): SetListaCompetencias => {
  return {
    type: typeSetListaCompetencias,
    payload,
  };
};
