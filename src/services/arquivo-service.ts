import { RetornoUploadArquivoDto } from '~/domain/dto/RetornoUploadArquivoDto';
import { TipoArquivoEnum } from '~/domain/enums/TipoArquivoEnum';
import api from './api';
const URL_DEFAULT = '/api/v1/Arquivo';

const uploadVideo = async (arquivo: File) => {
  console.log('🎬 Iniciando upload de vídeo:', {
    fileName: arquivo.name,
    contentType: arquivo.type,
    contentLength: arquivo.size,
    tipoArquivoEnum: TipoArquivoEnum.Video
  });
  
  // Valida se é realmente um vídeo
  if (!arquivo.type.startsWith('video/')) {
    throw new Error('Tipo de arquivo inválido para upload de vídeo');
  }

  try {
    const fullUrl = `${URL_DEFAULT}/upload/${TipoArquivoEnum.Video}`;
    console.log('🌐 Chamando endpoint:', fullUrl);
    
    // � Cria novo File com timestamp para evitar conflitos 409
    const timestamp = Date.now();
    const fileName = arquivo.name;
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    const uniqueFileName = `${baseName}_${timestamp}${extension}`;
    
    const uniqueFile = new File([arquivo], uniqueFileName, { type: arquivo.type });
    
    //  Cria FormData para envio do arquivo
    const formData = new FormData();
    formData.append('File', uniqueFile); // 🔧 Campo deve coincidir com ArquivoDto.File no backend C#
    
    console.log('📋 Enviando arquivo via FormData:');
    console.log('   - Nome original:', arquivo.name);
    console.log('   - Nome único:', uniqueFileName);
    console.log('   - Tipo:', arquivo.type);
    console.log('   - Tamanho:', arquivo.size, 'bytes');
    console.log('   - TipoArquivo:', TipoArquivoEnum.Video, '(Video)');
    
    const response = await api.post<RetornoUploadArquivoDto>(
      fullUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 180000, // 3 minutos para arquivos grandes
      }
    );
    
    console.log('✅ Upload de vídeo realizado com sucesso:', response.data);
    return response;
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message;
    
    console.error('❌ Erro no upload de vídeo:', {
      status,
      message,
      data: error?.response?.data
    });

    // 🔧 Tratamento específico para erro 409 Conflict
    if (status === 409) {
      console.warn('⚠️ Conflito detectado - arquivo pode já existir com este nome');
      // Adiciona informação mais clara sobre o conflito
      const conflictError = new Error(`Conflito no upload: ${message || 'Arquivo pode já existir'}`);
      (conflictError as any).status = 409;
      (conflictError as any).isConflict = true;
      throw conflictError;
    }
    
    throw error;
  }
};

const uploadAudio = async (arquivo: File) => {
  console.log('🎵 Iniciando upload de áudio:', {
    fileName: arquivo.name,
    contentType: arquivo.type,
    contentLength: arquivo.size,
    tipoArquivoEnum: TipoArquivoEnum.Audio
  });
  
  // Valida se é realmente um áudio
  if (!arquivo.type.startsWith('audio/')) {
    throw new Error('Tipo de arquivo inválido para upload de áudio');
  }

  try {
    const fullUrl = `${URL_DEFAULT}/upload/${TipoArquivoEnum.Audio}`;
    console.log('🌐 Chamando endpoint:', fullUrl);

    // � Cria novo File com timestamp para evitar conflitos 409
    const timestamp = Date.now();
    const fileName = arquivo.name;
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    const uniqueFileName = `${baseName}_${timestamp}${extension}`;
    
    const uniqueFile = new File([arquivo], uniqueFileName, { type: arquivo.type });

    //  Cria FormData para envio do arquivo
    const formData = new FormData();
    formData.append('File', uniqueFile); // 🔧 Campo deve coincidir com ArquivoDto.File no backend C#
    
    console.log('📋 Enviando arquivo via FormData:');
    console.log('   - Nome original:', arquivo.name);
    console.log('   - Nome único:', uniqueFileName);
    console.log('   - Tipo:', arquivo.type);
    console.log('   - Tamanho:', arquivo.size, 'bytes');
    console.log('   - TipoArquivo:', TipoArquivoEnum.Audio, '(Audio)');
    
    const response = await api.post<RetornoUploadArquivoDto>(
      fullUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 180000, // 3 minutos para arquivos grandes
      }
    );
    
    console.log('✅ Upload de áudio realizado com sucesso:', response.data);
    return response;
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message;
    
    console.error('❌ Erro no upload de áudio:', {
      status,
      message,
      data: error?.response?.data
    });

    // 🔧 Tratamento específico para erro 409 Conflict
    if (status === 409) {
      console.warn('⚠️ Conflito detectado - arquivo pode já existir com este nome');
      // Adiciona informação mais clara sobre o conflito
      const conflictError = new Error(`Conflito no upload: ${message || 'Arquivo pode já existir'}`);
      (conflictError as any).status = 409;
      (conflictError as any).isConflict = true;
      throw conflictError;
    }
    
    throw error;
  }
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

/**
 * Remove um arquivo do servidor pelo ID
 */
const removerArquivo = async (idFile: number) => {
  console.log('🗑️ Removendo arquivo do servidor:', idFile);
  
  try {
    const response = await api.delete(`${URL_DEFAULT}/${idFile}`);
    console.log('✅ Arquivo removido do servidor com sucesso:', idFile);
    
    // Retorna um objeto padronizado sempre
    return {
      success: true,
      status: response?.status || 200,
      data: response?.data || null
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message;
    
    console.error('❌ Erro ao remover arquivo do servidor:', {
      idFile,
      status,
      message,
      data: error?.response?.data
    });
    
    // Retorna um erro padronizado
    const errorResponse = {
      success: false,
      status: status || 500,
      message: message || 'Erro desconhecido ao remover arquivo',
      data: error?.response?.data || null
    };
    
    throw errorResponse;
  }
};

export default {
  uploadVideo,
  uploadAudio,
  obterArquivoPorId,
  obterUrlPublica,
  obterArquivosPorItemId,
  removerArquivo,
};
