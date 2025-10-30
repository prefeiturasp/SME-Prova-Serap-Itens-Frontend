export interface PaginacaoDto<T> {
  itens: T[];
  pagina: number;
  tamanhoPagina: number;
  totalRegistros: number;
  totalPaginas: number;
}
