export enum Situacao {
  Inativo = 0,
  Ativo = 1,
  Pendente = 2,
  Rascunho = 3,
}

export const SituacaoDescricao: Record<Situacao, string> = {
  [Situacao.Inativo]: 'Inativo',
  [Situacao.Ativo]: 'Ativo',
  [Situacao.Pendente]: 'Pendente',
  [Situacao.Rascunho]: 'Rascunho',
};