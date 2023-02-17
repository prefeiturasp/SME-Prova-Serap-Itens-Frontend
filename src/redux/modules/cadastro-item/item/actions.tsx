import { ItemProps } from './reducers';

export const typeSetFiltroAtual = '@itemPrincipal/setItemPrincipal';

export interface SetItem {
  type: typeof typeSetFiltroAtual;
  payload: ItemProps;
}

export const setItem = (payload: ItemProps): SetItem => {
  return {
    type: typeSetFiltroAtual,
    payload,
  };
};
