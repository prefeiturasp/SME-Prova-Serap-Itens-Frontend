import { DisciplinaProps } from './reducers';

export const typeSetDisciplinaAtual = '@disciplina/setDisciplina';

export interface SetDisciplinaAtual {
  type: typeof typeSetDisciplinaAtual;
  payload: DisciplinaProps;
}

export const setDisciplinaAtual = (payload: DisciplinaProps): SetDisciplinaAtual => {
  return {
    type: typeSetDisciplinaAtual,
    payload,
  };
};
