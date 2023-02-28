import {
  ItemProps,
  ConfiguracaoItemProps,
  ComponentesItemProps,
  ElaboracaoItemProps,
} from './reducers';

export const typeSetItemAtual = '@itemPrincipal/setItemAtual';
export const typeSetConfiguracaoItem = '@itemPrincipal/setConfiguracaoItem';
export const typeSetComponentesItem = '@itemPrincipal/setComponentesItem';
export const typeSetElaboracaoItem = '@itemPrincipal/setElaboracaoItem';

export interface SetItem {
  type: typeof typeSetItemAtual;
  payload: ItemProps;
}

export interface SetConfiguracaoItem {
  type: typeof typeSetConfiguracaoItem;
  payload: ConfiguracaoItemProps;
}

export interface SetComponentesItem {
  type: typeof typeSetComponentesItem;
  payload: ComponentesItemProps;
}

export interface SetElaboracaoItem {
  type: typeof typeSetElaboracaoItem;
  payload: ElaboracaoItemProps;
}

export const setItem = (payload: ItemProps): SetItem => {
  return {
    type: typeSetItemAtual,
    payload,
  };
};

export const setConfiguracaoItem = (payload: ConfiguracaoItemProps): SetConfiguracaoItem => {
  return {
    type: typeSetConfiguracaoItem,
    payload,
  };
};

export const setComponentesItem = (payload: ComponentesItemProps): SetComponentesItem => {
  return {
    type: typeSetComponentesItem,
    payload,
  };
};

export const setElaboracaoItem = (payload: ElaboracaoItemProps): SetElaboracaoItem => {
  return {
    type: typeSetElaboracaoItem,
    payload,
  };
};
