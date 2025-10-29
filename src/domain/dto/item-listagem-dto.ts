import type { Situacao } from "../enums/situacao";

export interface ItemListagemDto {
  codigoItem: string;
  disciplina: string;
  enunciado: string;
  dificuldade: string;
  situacao: Situacao;
  dataCriacao: string;
}