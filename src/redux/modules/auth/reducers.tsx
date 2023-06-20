import produce from 'immer';

import {
  SetDataHoraExpiracao,
  SetIsAuthenticated,
  SetToken,
  typeSetDataHoraExpiracao,
  typeSetIsAuthenticated,
  typeSetToken,
} from './actions';

export interface AuthProps {
  token: string;
  isAuthenticated: boolean;
  dataHoraExpiracao: string;
}

const initialValues = {
  token: '',
  isAuthenticated: false,
  dataHoraExpiracao: '',
};

const auth = (
  state: AuthProps = initialValues,
  action: SetToken | SetIsAuthenticated | SetDataHoraExpiracao,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetToken:
        draft.token = action.payload;
        break;
      case typeSetIsAuthenticated:
        draft.isAuthenticated = action.payload;
        break;
      case typeSetDataHoraExpiracao:
        draft.dataHoraExpiracao = action.payload;
        break;
      default:
        break;
    }
  });
};

export default auth;
