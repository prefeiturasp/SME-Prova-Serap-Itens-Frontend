export const typeSetToken = '@auth/setToken';
export const typeSetIsAuthenticated = '@auth/setIsAuthenticated';
export const typeSetDataHoraExpiracao = '@auth/setDataHoraExpiracao';

export interface SetToken {
  type: typeof typeSetToken;
  payload: string;
}

export interface SetIsAuthenticated {
  type: typeof typeSetIsAuthenticated;
  payload: boolean;
}

export interface SetDataHoraExpiracao {
  type: typeof typeSetDataHoraExpiracao;
  payload: string;
}

export const setToken = (payload: string): SetToken => {
  return {
    type: typeSetToken,
    payload,
  };
};

export const setIsAuthenticated = (payload: boolean): SetIsAuthenticated => {
  return {
    type: typeSetIsAuthenticated,
    payload,
  };
};

export const setDataHoraExpiracao = (payload: string): SetDataHoraExpiracao => {
  return {
    type: typeSetDataHoraExpiracao,
    payload,
  };
};
