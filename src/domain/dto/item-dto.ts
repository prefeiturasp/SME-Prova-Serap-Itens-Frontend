import { SelectValueType } from '~/domain/type/select';

export interface ItemDto {
  id: number;
  codigoItem: number | null;
  areaConhecimentoId: SelectValueType;
  disciplinaId: SelectValueType;
  matrizId: SelectValueType;
  competenciaId: SelectValueType;
  habilidadeId: SelectValueType;
  anoMatrizId: SelectValueType;
  assunto: SelectValueType;
  subAssunto: SelectValueType;
  situacaoItem: SelectValueType;
  tipoItem: SelectValueType;
  quantidadeAlternativas: SelectValueType;
  dificuldadeSugeridaId: SelectValueType;
  discriminacao: number | string | null;
  dificuldade: number | string | null;
  acertoCasual: number | string | null;
  palavrasChave: string | null;
  parametroBTransformado: number | string | null;
  mediaDesvioPadrao: string | null;
  observacao: string | null;
  textoBase: string;
}
