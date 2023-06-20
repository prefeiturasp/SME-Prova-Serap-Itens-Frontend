import { AxiosResponse } from 'axios';
import api from './api';

const URL_DEFAULT = '/api/v1/autenticacao';
export const URL_AUTENTICACAO_REVALIDAR = `${URL_DEFAULT}/revalidar`;

const autenticarValidar = (codigo: string): Promise<AxiosResponse> =>
  api.post(`${URL_DEFAULT}/validar`, { codigo });

const autenticarRevalidar = (token: string): Promise<AxiosResponse> =>
  api.post(URL_AUTENTICACAO_REVALIDAR, { token });

export default {
  autenticarValidar,
  autenticarRevalidar,
};
