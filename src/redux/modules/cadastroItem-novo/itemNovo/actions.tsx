import {
  ItemNovoProps,
  ConfiguracaoItemNovoProps,
  ElaboracaoItemNovoProps,
} from './reducers';

export const typeSetItemAtualNovo = '@itemPrincipal/setItemAtual';
export const typeSetConfiguracaoItemNovo = '@itemPrincipal/setConfiguracaoItem';
export const typeSetElaboracaoItemNovo = '@itemPrincipal/setElaboracaoItem';

export interface SetItemNovo {
  type: typeof typeSetItemAtualNovo;
  payload: ItemNovoProps;
}

export interface SetConfiguracaoItemNovo {
  type: typeof typeSetConfiguracaoItemNovo;
  payload: ConfiguracaoItemNovoProps;
}

export interface SetElaboracaoItemNovo {
  type: typeof typeSetElaboracaoItemNovo;
  payload: ElaboracaoItemNovoProps;
}

export const setItemNovo = (payload: ItemNovoProps): SetItemNovo => {
  return {
    type: typeSetItemAtualNovo,
    payload,
  };
};

export const setConfiguracaoItemNovo = (payload: Partial<ConfiguracaoItemNovoProps>) => ({
  type: typeSetConfiguracaoItemNovo,
  payload,
});


export const setElaboracaoItemNovo = (payload: ElaboracaoItemNovoProps): SetElaboracaoItemNovo => {
  return {
    type: typeSetElaboracaoItemNovo,
    payload,
  };
};
