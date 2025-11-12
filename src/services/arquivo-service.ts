import { RetornoUploadArquivoDto } from '~/domain/dto/RetornoUploadArquivoDto';
import { UploadArquivoRequestDto } from '~/domain/dto/UploadArquivoRequestDto';
import { TipoArquivoEnum } from '~/domain/enums/TipoArquivoEnum';
import api from './api';
const URL_DEFAULT = '/api/v1/arquivo';

const uploadVideo = (audioVideo: UploadArquivoRequestDto) => {
  console.log('Iniciando upload de vídeo:', audioVideo);
  // Valida se é realmente um vídeo
  if (audioVideo.fileType !== TipoArquivoEnum.Video) {
    throw new Error('Tipo de arquivo inválido para upload de vídeo');
  }

  return api.post<RetornoUploadArquivoDto>(
    `${URL_DEFAULT}/Upload/AudioVideo`,
    audioVideo,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

const uploadAudio = (audioVideo: UploadArquivoRequestDto) => {
  // Valida se é realmente um áudio
  if (audioVideo.fileType !== TipoArquivoEnum.Audio) {
    throw new Error('Tipo de arquivo inválido para upload de áudio');
  }

  return api.post<RetornoUploadArquivoDto>(
    `${URL_DEFAULT}/Upload/AudioVideo`,
    audioVideo,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Busca informações de um arquivo pelo ID
 */
const obterArquivoPorId = (idFile: number) => {
  return api.get<RetornoUploadArquivoDto>(`${URL_DEFAULT}/${idFile}`);
};

/**
 * Obtém a URL pública de um arquivo pelo ID
 */
const obterUrlPublica = (idFile: number): Promise<string> => {
  return obterArquivoPorId(idFile)
    .then(response => response.data.fileLink)
    .catch(error => {
      console.error('Erro ao obter URL pública do arquivo:', error);
      throw error;
    });
};

/**
 * Interface para resposta da consulta de arquivos por item
 */
interface ArquivosItemDto {
  audioNome?: string;
  audioCaminho?: string;
  videoNome?: string;
  videoCaminho?: string;
}

/**
 * Busca arquivos de vídeo e áudio associados a um item
 */
const obterArquivosPorItemId = (itemId: number) => {
  return api.get<ArquivosItemDto>(`${URL_DEFAULT}/${itemId}`);
};

export default {
  uploadVideo,
  uploadAudio,
  obterArquivoPorId,
  obterUrlPublica,
  obterArquivosPorItemId,
};
