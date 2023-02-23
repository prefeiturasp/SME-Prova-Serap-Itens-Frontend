import produce from 'immer';
import { SelectValueType } from '~/domain/type/select';

import {
  SetItem,
  typeSetItemAtual,
  SetConfiguracaoItem,
  typeSetConfiguracaoItem,
  SetComponentesItem,
  typeSetComponentesItem,
  SetElaboracaoItem,
  typeSetElaboracaoItem,
} from './actions';

export interface ConfiguracaoItemProps {
  codigo: number;
  areaConhecimento: SelectValueType;
  disciplina: SelectValueType;
  matriz: SelectValueType;
}
const initialValuesConfiguracaoItemProps = {
  codigo: 0,
  areaConhecimento: null,
  disciplina: null,
  matriz: null,
};

export interface ComponentesItemProps {
  competencia: SelectValueType;
  habilidade: SelectValueType;
  anoMatriz: SelectValueType;
  dificuldadeSugerida: SelectValueType;
}
const initialValuesComponentesItemProps = {
  competencia: null,
  habilidade: null,
  anoMatriz: null,
  dificuldadeSugerida: null,
};

export interface ElaboracaoItemProps {
  textoBase?: string;
}
const initialValuesElaboracaoItemProps = {
  textoBase: undefined,
};

export interface ItemProps {
  id: number;
  configuracao?: ConfiguracaoItemProps;
  componentes?: ComponentesItemProps;
  elaboracao?: ElaboracaoItemProps;
}

const initialValuesItemProps = {
  id: 0,
  configuracao: undefined,
  componentes: undefined,
  elaboracao: undefined,
};

export const itemPrincipal = (state: ItemProps = initialValuesItemProps, action: SetItem) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetItemAtual:
        draft.id = action.payload.id;
        draft.configuracao = action.payload.configuracao;
        draft.componentes = action.payload.componentes;
        draft.elaboracao = action.payload.elaboracao;
        break;
      default:
        break;
    }
  });
};

export const configuracaoItem = (
  state: ConfiguracaoItemProps = initialValuesConfiguracaoItemProps,
  action: SetConfiguracaoItem,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetConfiguracaoItem:
        draft.codigo = action.payload.codigo;
        draft.areaConhecimento = action.payload.areaConhecimento;
        draft.disciplina = action.payload.disciplina;
        draft.matriz = action.payload.matriz;
        break;
      default:
        break;
    }
  });
};

export const componentesItem = (
  state: ComponentesItemProps = initialValuesComponentesItemProps,
  action: SetComponentesItem,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetComponentesItem:
        draft.competencia = action.payload.competencia;
        draft.habilidade = action.payload.habilidade;
        draft.anoMatriz = action.payload.anoMatriz;
        draft.dificuldadeSugerida = action.payload.dificuldadeSugerida;
        break;
      default:
        break;
    }
  });
};

export const elaboracaoItem = (
  state: ElaboracaoItemProps = initialValuesElaboracaoItemProps,
  action: SetElaboracaoItem,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetElaboracaoItem:
        draft.textoBase = action.payload.textoBase;
        break;
      default:
        break;
    }
  });
};
