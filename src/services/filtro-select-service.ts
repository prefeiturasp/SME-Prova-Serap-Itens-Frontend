import { SelectValueType } from '~/domain/type/select';
import api from './api';
import { SelecioneDto } from '~/domain/dto/selecione-dto';
const URL_DEFAULT = '/api/v1';

const obterListaItems = (codigoItem: SelectValueType): Promise<SelecioneDto[]> => {
  const params = new URLSearchParams(); 
  if(codigoItem != null){
    params.append("codigoItem", String(codigoItem))
  }
  return api.get<SelecioneDto[]>(`${URL_DEFAULT}/item/Codigos?${params.toString()}`).then(response => response.data)
}
export default {
  obterListaItems
};
