import { AreaConhecimentoProps } from './reducers';

export const typeSetAreaAtual = '@areaConhecimento/setAreaAtual';

export interface SetAreaAtual { 
  type: typeof typeSetAreaAtual; 
  payload: AreaConhecimentoProps;
}

export const setAreaAtual = (payload: AreaConhecimentoProps): SetAreaAtual => {
  return {
    type: typeSetAreaAtual,
    payload,
  };
};
