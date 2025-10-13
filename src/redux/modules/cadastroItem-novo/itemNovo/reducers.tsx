import produce from 'immer';
import { SelectValueType } from '~/domain/type/select';

import {
  SetItemNovo,
  typeSetItemAtualNovo,
  SetConfiguracaoItemNovo,
  typeSetConfiguracaoItemNovo,
  SetElaboracaoItemNovo,
  typeSetElaboracaoItemNovo,
} from './actions';

export interface ConfiguracaoItemNovoProps {
  codigo: number;
  areaConhecimento: SelectValueType;
  disciplina: SelectValueType;
  matriz: SelectValueType;
  anoMatriz: SelectValueType;
  competencia: SelectValueType;
  habilidade: SelectValueType;
  assunto: SelectValueType;
  subAssunto: SelectValueType;
  situacaoItem: SelectValueType;
  tipoItem: SelectValueType;
  quantidadeAlternativas: SelectValueType;
  dificuldadeSugerida: SelectValueType;
  nivelItem: SelectValueType;
  discriminacao: number | string | null;
  dificuldade: number | string | null;
  acertoCasual: number | string | null;
  palavrasChave: string[] | null;
  parametroBTransformado: number | string | null;
  mediaDesvioPadrao: string | null;
  sentencaDescritora: string | null;
  observacao: string | null;
}
const initialValuesConfiguracaoItemNovoProps = {
  codigo: 0,
  areaConhecimento: null,
  disciplina: null,
  matriz: null,
  anoMatriz: null,
  competencia: null,
  habilidade: null,
  assunto: null,
  subAssunto: null,
  situacaoItem: null,
  tipoItem: null,
  quantidadeAlternativas: null,
  dificuldadeSugerida: null,
  nivelItem: null,
  discriminacao: null,
  dificuldade: null,
  acertoCasual: null,
  palavrasChave: null,
  parametroBTransformado: null,
  mediaDesvioPadrao: null,
  sentencaDescritora: null,
  observacao: null,
};

export interface ElaboracaoItemNovoProps {
  textoBase?: string;
}
const initialValuesElaboracaoItemNovoProps = {
  textoBase: undefined,
};

export interface ItemNovoProps {
  id: number;
  configuracao?: ConfiguracaoItemNovoProps;
  elaboracao?: ElaboracaoItemNovoProps;
}
const initialValuesItemNovoProps = {
  id: 0,
  configuracao: undefined,
  elaboracao: undefined,
};

export const itemPrincipalNovo = (state: ItemNovoProps = initialValuesItemNovoProps, action: SetItemNovo) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetItemAtualNovo:
        draft.id = action.payload.id;
        draft.configuracao = action.payload.configuracao;
        draft.elaboracao = action.payload.elaboracao;
        break;
      default:
        break;
    }
  });
};

export const configuracaoItemNovo = (
  state: ConfiguracaoItemNovoProps = initialValuesConfiguracaoItemNovoProps,
  action: SetConfiguracaoItemNovo,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetConfiguracaoItemNovo:
        draft.codigo = action.payload.codigo;
        draft.areaConhecimento = action.payload.areaConhecimento;
        draft.disciplina = action.payload.disciplina;
        draft.matriz = action.payload.matriz;
        draft.anoMatriz = action.payload.anoMatriz;
        draft.competencia = action.payload.competencia;
        draft.habilidade = action.payload.habilidade;       
        draft.dificuldadeSugerida = action.payload.dificuldadeSugerida;
        draft.discriminacao = action.payload.discriminacao;
        draft.dificuldade = action.payload.dificuldade;
        draft.nivelItem = action.payload.nivelItem;
        draft.acertoCasual = action.payload.acertoCasual;
        draft.assunto = action.payload.assunto;
        draft.subAssunto = action.payload.subAssunto;
        draft.situacaoItem = action.payload.situacaoItem;
        draft.tipoItem = action.payload.tipoItem;
        draft.quantidadeAlternativas = action.payload.quantidadeAlternativas;
        draft.palavrasChave = action.payload.palavrasChave;
        draft.parametroBTransformado = action.payload.parametroBTransformado;
        draft.mediaDesvioPadrao = action.payload.mediaDesvioPadrao;
        draft.sentencaDescritora = action.payload.sentencaDescritora;
        draft.observacao = action.payload.observacao;
        break;
      default:
        break;
    }
  });
};

export const elaboracaoItemNovo = (
  state: ElaboracaoItemNovoProps = initialValuesElaboracaoItemNovoProps,
  action: SetElaboracaoItemNovo,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetElaboracaoItemNovo:
        draft.textoBase = action.payload.textoBase;
        break;
      default:
        break;
    }
  });
};
