import { FiltroPrincipalProps } from './reducers';

export const typeSetFiltroAtual = '@filtroPrincipal/setFiltroAtual';

export interface SetFiltroAtual {
  type: typeof typeSetFiltroAtual;
  payload: FiltroPrincipalProps;
}

export const setFiltroAtual = (payload: FiltroPrincipalProps): SetFiltroAtual => {
  return {
    type: typeSetFiltroAtual,
    payload,
  };
};
