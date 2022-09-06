export const typeSetDataUltimaAtualizacao = '@geral/setDataUltimaAtualizacao';
export const typeSetAbrirFiltroPrincipal = '@geral/setAbrirFiltroPrincipal';
export const typeSetCarregarDadosResumoProva = '@geral/setCarregarDadosResumoProva';
export const typeSetCarregarDadosTotalizadores = '@geral/setCarregarDadosTotalizadores';

export interface SetDataUltimaAtualizacao {
  type: typeof typeSetDataUltimaAtualizacao;
  payload: Date | null;
}

export interface SetAbrirFiltroPrincipal {
  type: typeof typeSetAbrirFiltroPrincipal;
  payload: boolean;
}

export interface SetCarregarDadosResumoProva {
  type: typeof typeSetCarregarDadosResumoProva;
  payload: boolean;
}

export interface SetCarregarDadosTotalizadores {
  type: typeof typeSetCarregarDadosTotalizadores;
  payload: boolean;
}

export const setDataUltimaAtualizacao = (payload: Date): SetDataUltimaAtualizacao => {
  return {
    type: typeSetDataUltimaAtualizacao,
    payload,
  };
};

export const setAbrirFiltroPrincipal = (payload: boolean): SetAbrirFiltroPrincipal => {
  return {
    type: typeSetAbrirFiltroPrincipal,
    payload,
  };
};

export const setCarregarDadosResumoProva = (payload: boolean): SetCarregarDadosResumoProva => {
  return {
    type: typeSetCarregarDadosResumoProva,
    payload,
  };
};

export const setCarregarDadosTotalizadores = (payload: boolean): SetCarregarDadosTotalizadores => {
  return {
    type: typeSetCarregarDadosTotalizadores,
    payload,
  };
};
