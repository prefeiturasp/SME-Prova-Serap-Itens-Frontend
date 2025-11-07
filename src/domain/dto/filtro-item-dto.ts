export interface FiltroItemDto {
  areaConhecimentoId?: number;
  categoriaId?: number;
  codigoItem?: string;
  disciplinaId?: number;
  matrizId?: number;
  competenciaId?: number;
  dificuldadeSugeridaId?: number;
  situacao?: number;
  habilidadeId?: number;
  pagina: number;
  tamanhoPagina: number;
  informacoesEstatistica?: boolean
  palavraChave?: string;
  anoMatrizId?: number;
}