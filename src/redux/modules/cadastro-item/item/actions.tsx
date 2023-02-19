import { ItemProps } from './reducers';

export const typeSetItemAtual = '@itemPrincipal/setItemAtual';
export const typeSetIdItemAtual = '@itemPrincipal/setIdItemAtual';

export interface SetItem {
  type: typeof typeSetItemAtual;
  payload: ItemProps;
}

export interface SetIdItem {
  type: typeof typeSetIdItemAtual;
  payload: number;
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
