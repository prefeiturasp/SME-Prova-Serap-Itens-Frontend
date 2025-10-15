import { SelectValueType } from '~/domain/type/select';
import { AltenativaDto } from '~/domain/dto/AltenativaDto';

export interface ItemNovoDto {
  id: number;
  codigoItem: number | null;

  AreaConhecimentoId: SelectValueType;
  DisciplinaId: SelectValueType;
  MatrizId: SelectValueType;
  AnoMatrizId: SelectValueType;

  CompetenciaId: SelectValueType;
  HabilidadeId: SelectValueType;

  AssuntoId: SelectValueType;
  SubAssuntoId: SelectValueType;
  Situacao: SelectValueType;
  TipoItem: SelectValueType;
  QuantidadeAlternativasId: SelectValueType;

  DificuldadeSugeridaId: SelectValueType;
  Discriminacao: number | string | null;
  Dificuldade: number | string | null;
  NivelItem: SelectValueType;
  AcertoCasual: number | string | null;
  PalavrasChave: string[] | null;
  ParametroBTransformado: number | string | null;
  MediaEhDesvio: string | null;
  Observacao: string | null;
  SentencaDescritora: string | null;
  TextoBase: string;
  Fonte: string;
  Enunciado: string;
  AlternativasDto?: AltenativaDto[];
  ArquivoVideoId?: number;
  ArquivoAudioId?: number;
}
