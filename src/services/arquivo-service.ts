import { AxiosRequestConfig } from 'axios';
import { RetornoUploadArquivoDto } from '~/domain/dto/RetornoUploadArquivoDto';
import { TipoArquivoEnum } from '~/domain/enums/TipoArquivoEnum';
import api from './api';
const URL_DEFAULT = '/api/v1/arquivo';

const uploadVideo = (formData: FormData, config: AxiosRequestConfig) =>
  api.post<RetornoUploadArquivoDto>(
    `${URL_DEFAULT}/upload/${TipoArquivoEnum.Video}`,
    formData,
    config,
  );

const uploadAudio = (formData: FormData, config: AxiosRequestConfig) =>
  api.post<RetornoUploadArquivoDto>(
    `${URL_DEFAULT}/upload/${TipoArquivoEnum.Audio}`,
    formData,
    config,
  );

export default {
  uploadVideo,
  uploadAudio,
};
