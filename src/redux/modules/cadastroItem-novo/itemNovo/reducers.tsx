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
  fonte?: string;
  enunciado?: string;
  codigoItem?: string;
  video?: any; // Arquivo de vídeo do upload
  audio?: any; // Arquivo de áudio do upload
  alternativaA?: string;
  justificativaA?: string;
  alternativaB?: string;
  justificativaB?: string;
  alternativaC?: string;
  justificativaC?: string;
  alternativaD?: string;
  justificativaD?: string;
  alternativaCorreta?: string; // "A", "B", "C" ou "D"
  alternativasDto?: any[]; // AlternativaRascunhoDto[] - será montado baseado nos campos acima
  arquivoVideoId?: number;
  arquivoAudioId?: number;
  // 🆔 IDs das alternativas para update (vindos do backend)
  idAlternativaA?: number | null;
  idAlternativaB?: number | null;
  idAlternativaC?: number | null;
  idAlternativaD?: number | null;
}

const initialValuesElaboracaoItemNovoProps = {
  textoBase: undefined,
  fonte: undefined,
  enunciado: undefined,
  codigoItem: undefined,
  video: undefined,
  audio: undefined,
  alternativaA: undefined,
  justificativaA: undefined,
  alternativaB: undefined,
  justificativaB: undefined,
  alternativaC: undefined,
  justificativaC: undefined,
  alternativaD: undefined,
  justificativaD: undefined,
  alternativaCorreta: undefined,
  alternativasDto: undefined,
  arquivoVideoId: undefined,
  arquivoAudioId: undefined,
  // 🆔 IDs das alternativas para update
  idAlternativaA: undefined,
  idAlternativaB: undefined,
  idAlternativaC: undefined,
  idAlternativaD: undefined,
};

export interface ItemNovoProps {
  id: number;
  configuracao?: Partial<ConfiguracaoItemNovoProps>;
  elaboracao?: Partial<ElaboracaoItemNovoProps>;
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
  state: Partial<ConfiguracaoItemNovoProps> = initialValuesConfiguracaoItemNovoProps,
  action: SetConfiguracaoItemNovo,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetConfiguracaoItemNovo:
        Object.assign(draft, action.payload);
        break;
      default:
        break;
    }
  });
};

export const elaboracaoItemNovo = (
  state: Partial<ElaboracaoItemNovoProps> = initialValuesElaboracaoItemNovoProps,
  action: SetElaboracaoItemNovo,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetElaboracaoItemNovo:
        Object.assign(draft, action.payload);
        break;
      default:
        break;
    }
  });
};
