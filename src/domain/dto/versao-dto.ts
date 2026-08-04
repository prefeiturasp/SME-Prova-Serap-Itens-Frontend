export interface VersaoDto {
  id: number;
  codigoItem: string;
  versaoItem: number;
  dataCriacao: string;
  situacao: number;
  provas?: string[];
}