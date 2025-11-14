import { TipoArquivoEnum } from '../enums/TipoArquivoEnum';

export interface UploadArquivoRequestDto {
  contentLength: number;
  contentType: string;
  fileName: string;
  inputStream: string; // Base64 string do arquivo
  fileType: TipoArquivoEnum;
}