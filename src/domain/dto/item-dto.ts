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
  dificuldadeId: SelectValueType;
  discriminacao: number | string | null;
  dificuldade: number | string | null;
  acertoCasual: number | string | null;
  textoBase: string;
}
