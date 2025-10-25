import { MatrizProps } from './reducers';

export const typeSetMatrizAtual = '@matriz/setMatriz';

export interface SetMatrizAtual { 
  type: typeof typeSetMatrizAtual; 
  payload: MatrizProps;
}

export const setMatrizAtual = (payload: MatrizProps): SetMatrizAtual => {
  return {
    type: typeSetMatrizAtual,
    payload,
  };
};
