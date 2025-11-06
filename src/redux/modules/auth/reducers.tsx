import produce from 'immer';

const storedToken = localStorage.getItem('authToken');
const storedExpiresAt = localStorage.getItem('authExpiresAt');
const storedTipoPerfil = localStorage.getItem('tipoPerfil');

const isTokenValid = storedToken && storedExpiresAt && new Date(storedExpiresAt) > new Date();

const initialState = {
  isAuthenticated: isTokenValid,
  token: storedToken || null,
  dataHoraExpiracao: storedExpiresAt || null,
  tipoPerfil: storedTipoPerfil ? Number(storedTipoPerfil) : null,
};

const SET_USER_LOGGED = 'auth/setUserLogged';
const LOGOUT = 'auth/logout';

export const auth = produce((draft, action) => {
  switch (action.type) {
    case SET_USER_LOGGED: {
      const { token, dataHoraExpiracao } = action.payload;
      draft.isAuthenticated = true;
      draft.token = token;
      draft.dataHoraExpiracao = dataHoraExpiracao;

      localStorage.setItem('authToken', token);
      localStorage.setItem('authExpiresAt', dataHoraExpiracao);
      break;
    }

    case LOGOUT: {
      draft.isAuthenticated = false;
      draft.token = null;
      draft.dataHoraExpiracao = null;
      draft.tipoPerfil = null;

      localStorage.removeItem('authToken');
      localStorage.removeItem('authExpiresAt');
      break;
    }

    default:
      break;
  }
}, initialState);

export const setUserLogged = (payload: any) => ({
  type: SET_USER_LOGGED,
  payload,
});

export const logout = () => ({
  type: LOGOUT,
});
