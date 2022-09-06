import produce from 'immer';

import {
  SetAbrirFiltroPrincipal,
  SetCarregarDadosResumoProva,
  SetCarregarDadosTotalizadores,
  SetDataUltimaAtualizacao,
  typeSetAbrirFiltroPrincipal,
  typeSetCarregarDadosResumoProva,
  typeSetCarregarDadosTotalizadores,
  typeSetDataUltimaAtualizacao,
} from './actions';

export interface GeralProps {
  dataUltimaAtualizacao: Date | null;
  abrirFiltroPrincipal: boolean;
  carregarDadosResumoProva: boolean;
  carregarDadosTotalizadores: boolean;
}

const initialValues = {
  dataUltimaAtualizacao: null,
  abrirFiltroPrincipal: false,
  carregarDadosResumoProva: false,
  carregarDadosTotalizadores: false,
};

const geral = (
  state: GeralProps = initialValues,
  action:
    | SetDataUltimaAtualizacao
    | SetAbrirFiltroPrincipal
    | SetCarregarDadosResumoProva
    | SetCarregarDadosTotalizadores,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetDataUltimaAtualizacao:
        draft.dataUltimaAtualizacao = action.payload;
        break;
      case typeSetAbrirFiltroPrincipal:
        draft.abrirFiltroPrincipal = action.payload;
        break;
      case typeSetCarregarDadosResumoProva:
        draft.carregarDadosResumoProva = action.payload;
        break;
      case typeSetCarregarDadosTotalizadores:
        draft.carregarDadosTotalizadores = action.payload;
        break;
      default:
        break;
    }
  });
};

export default geral;
