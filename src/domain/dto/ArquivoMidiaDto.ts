// Tipos para arquivos de mídia
export interface ArquivoMidiaDto {
  idFile?: number;
  fileLink?: string;
  name?: string;
  status?: 'uploading' | 'done' | 'error' | 'removed';
  uid?: string;
  url?: string;
  size?: number;
  type?: string;
}

export interface VideoArquivoDto extends ArquivoMidiaDto {
  // Propriedades específicas de vídeo se necessário
}

export interface AudioArquivoDto extends ArquivoMidiaDto {
  // Propriedades específicas de áudio se necessário
}