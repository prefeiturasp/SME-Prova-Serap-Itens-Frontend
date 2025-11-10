import type { FiltroItemDto } from '~/domain/dto/filtro-item-dto';

const carregarFiltroDeItensDoLocalStorage = () : FiltroItemDto => {
  const itemFiltroJson = localStorage.getItem('itemFiltro');
  if (!itemFiltroJson) return {};

  const itemFiltro = JSON.parse(itemFiltroJson || '{}');
  const filtroLateral = itemFiltro?.filtroLateral;

  if (!filtroLateral) return {};

  return {
    areaConhecimentoId: filtroLateral.areaConhecimentoFiltro,
    categoriaId: filtroLateral.categoriaItemFiltro,
    competenciaId: filtroLateral.competenciaFiltro,
    dificuldadeSugeridaId: filtroLateral.dificuldadeSugeridaFiltro,
    disciplinaId: filtroLateral.disciplinaFiltro,
    habilidadeId: filtroLateral.habilidadeFiltro,
    informacoesEstatistica: filtroLateral.informacoesEstatisticasFiltro,
    matrizId: filtroLateral.matrizFiltro,
    palavrasChave: filtroLateral.palavraChaveFiltro,
    situacao: filtroLateral.situacaoItemFiltro,
    anoMatrizId: filtroLateral.anoMatrizFiltro,
  };
}

export default carregarFiltroDeItensDoLocalStorage