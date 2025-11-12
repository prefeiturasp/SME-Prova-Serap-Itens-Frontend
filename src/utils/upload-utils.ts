import { UploadArquivoRequestDto } from '../domain/dto/UploadArquivoRequestDto';
import { TipoArquivoEnum } from '~/domain/enums/TipoArquivoEnum';

/**
 * Converte um arquivo para base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove o prefixo "data:tipo/mime;base64," para pegar apenas o base64
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Erro ao converter arquivo para base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Determina o tipo de arquivo baseado no MIME type
 */
export const getFileType = (mimeType: string): TipoArquivoEnum => {
  if (mimeType.startsWith('video/')) {
    return TipoArquivoEnum.Video;
  } else if (mimeType.startsWith('audio/')) {
    return TipoArquivoEnum.Audio;
  } else {
    throw new Error(`Tipo de arquivo não suportado: ${mimeType}`);
  }
};

/**
 * Cria o objeto UploadArquivoRequestDto a partir de um arquivo
 */
export const createUploadRequest = async (file: File): Promise<UploadArquivoRequestDto> => {
  try {
    const base64Content = await fileToBase64(file);
    const fileType = getFileType(file.type);

    return {
      contentLength: file.size,
      contentType: file.type,
      fileName: file.name,
      inputStream: base64Content,
      fileType: fileType,
    };
  } catch (error) {
    console.error('Erro ao criar request de upload:', error);
    throw error;
  }
};

/**
 * Valida se o tipo de arquivo é suportado
 */
export const isValidFileType = (mimeType: string): boolean => {
  return mimeType.startsWith('video/') || mimeType.startsWith('audio/');
};