import type { FiltroItemDto } from '~/domain/dto/filtro-item-dto';

const obterFiltrosLocalStorage = () : FiltroItemDto => {
  const itemFiltro = localStorage.getItem('itemFiltro');
  if(itemFiltro){
    const itemFiltroAtualizado = JSON.parse(itemFiltro || '{}');
    if (itemFiltroAtualizado?.filtroLateral){
      return {
        areaConhecimentoId: itemFiltroAtualizado.filtroLateral.areaConhecimentoFiltro,
        categoriaId: itemFiltroAtualizado.filtroLateral.categoriaItemFiltro,
        competenciaId: itemFiltroAtualizado.filtroLateral.competenciaFiltro,
        dificuldadeSugeridaId: itemFiltroAtualizado.filtroLateral.dificuldadeSugeridaFiltro,
        disciplinaId: itemFiltroAtualizado.filtroLateral.disciplinaFiltro,
        habilidadeId: itemFiltroAtualizado.filtroLateral.habilidadeFiltro,
        informacoesEstatistica: itemFiltroAtualizado.filtroLateral.informacoesEstatisticasFiltro,
        matrizId: itemFiltroAtualizado.filtroLateral.matrizFiltro,
        palavrasChave: itemFiltroAtualizado.filtroLateral.palavraChaveFiltro,
        situacao: itemFiltroAtualizado.filtroLateral.situacaoItemFiltro,
        anoMatrizId: itemFiltroAtualizado.filtroLateral.anoMatrizFiltro,
      }
    }
  }

  return {};
}

export default obterFiltrosLocalStorage