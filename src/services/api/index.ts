import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import moment from 'moment';
import { setDataHoraExpiracao, setIsAuthenticated, setToken } from '~/redux/modules/auth/actions';
import { AuthProps } from '~/redux/modules/auth/reducers';

import { store } from '../../redux';
import autenticacaoService, { URL_AUTENTICACAO_REVALIDAR } from '../autenticacao-service';

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_SME_SERAP_ITEM_API,
};

const api = axios.create({
  ...config,
});

const SEGUNDOS_ANTES_EXPIRAR = 0;
let refreshTokenPromise: any = null;

const deslogarDoSistema = () => {
  store.dispatch(setToken(''));
  store.dispatch(setDataHoraExpiracao(''));
  store.dispatch(setIsAuthenticated(false));
};

const getRefreshToken = (token: string) =>
  autenticacaoService.autenticarRevalidar(token).then((resp) => resp);

const revalidarAutenticacao = async (tokenAntigo: string) => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = getRefreshToken(tokenAntigo)
      .then((resposta) => {
        refreshTokenPromise = null;
        return resposta?.data;
      })
      .catch((e) => {
        console.log('Erro ao revalidar token', e);
        alert('Erro ao revalidar token');
        // erros(e)
      });
  }

  return refreshTokenPromise.then((dadosRefresh: AuthProps) => {
    if (dadosRefresh?.token) {
      store.dispatch(setToken(dadosRefresh.token));
      store.dispatch(setDataHoraExpiracao(dadosRefresh.dataHoraExpiracao));
    } else {
      deslogarDoSistema();
    }

    return dadosRefresh;
  });
};

const configPadraoAutenticacao = async (
  requestConfig: AxiosRequestConfig,
  token: string,
  dataHoraExpiracao: string,
) => {
  const diff = moment().diff(dataHoraExpiracao, 'seconds');

  if (requestConfig.headers) {
    requestConfig.headers['Content-Type'] = 'application/json';
    if (token) requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  if (
    requestConfig?.url !== URL_AUTENTICACAO_REVALIDAR &&
    token &&
    dataHoraExpiracao &&
    diff >= SEGUNDOS_ANTES_EXPIRAR
  ) {
    const dadosRevalidacao = await revalidarAutenticacao(token);
    if (requestConfig.headers && dadosRevalidacao?.token) {
      requestConfig.headers.Authorization = `Bearer ${dadosRevalidacao.token}`;
    } else {
      return Promise.reject();
    }
  }

  return requestConfig;
};

const configRevalidarAutenticacao = async (requestConfig: AxiosRequestConfig, token: string) => {
  if (requestConfig.headers && token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
};

api.interceptors.request.use(
  async (requestConfig: AxiosRequestConfig) => {
    const { token, dataHoraExpiracao } = store.getState().auth;

    if (requestConfig?.url !== URL_AUTENTICACAO_REVALIDAR) {
      return configPadraoAutenticacao(requestConfig, token, dataHoraExpiracao);
    }

    return configRevalidarAutenticacao(requestConfig, token);
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      deslogarDoSistema();
    }
    return Promise.reject(error);
  },
);

export default api;
