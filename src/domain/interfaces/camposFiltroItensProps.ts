import { SelectValueType } from '~/domain/type/select';

export interface CamposFiltroItensProps {
  areaConhecimentoFiltro: SelectValueType;
  disciplinaFiltro: SelectValueType;
  matrizFiltro: SelectValueType;
  anoMatrizFiltro: SelectValueType;
  competenciaFiltro: SelectValueType;
  habilidadeFiltro: SelectValueType;
  categoriaItemFiltro: SelectValueType;
  situacaoItemFiltro: SelectValueType;
  dificuldadeSugeridaFiltro: SelectValueType;
  informacoesEstatisticasFiltro: SelectValueType;
  palavraChaveFiltro: string[] | null;
}
