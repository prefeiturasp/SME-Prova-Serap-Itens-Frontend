import { SelectValueType } from '~/domain/type/select';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';

export interface ItemNovoDto {
  id: number;
  codigoItem: string | null;
  areaConhecimentoId: SelectValueType;
  disciplinaId: SelectValueType;
  matrizId: SelectValueType;
  anoMatrizId: SelectValueType;
  competenciaId: SelectValueType;
  habilidadeId: SelectValueType;  
  assuntoId: SelectValueType;
  subAssuntoId: SelectValueType;
  situacao: SelectValueType;
  tipo: SelectValueType;
  quantidadeAlternativasId: SelectValueType;
  dificuldadeSugeridaId: SelectValueType;
  discriminacao: number | string | null;
  dificuldade: number | string | null;
  nivelItem: SelectValueType;
  acertoCasual: number | string | null;
  palavrasChave: string | null;
  parametroBTransformado: number | string | null;
  mediaEhDesvio: string | null;
  observacao: string | null;
  sentencaDescritora: string | null;
  textoBase: string;
  fonte: string;
  enunciado: string;
  alternativasDto?: AltenativaDto[];
  arquivoVideoId?: number;
  arquivoAudioId?: number;
}
