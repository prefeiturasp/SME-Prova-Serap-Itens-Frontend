import api from './api';
import type { FiltroItemDto } from '~/domain/dto/filtro-item-dto';
import { converterDtoParaQueryString } from '~/utils/converte-dto';
import type { ItemListagemDto } from '~/domain/dto/item-listagem-dto';
import type { PaginacaoDto } from '~/domain/dto/paginacao-dto';

const obterListaItens = (filtro: FiltroItemDto): Promise<PaginacaoDto<ItemListagemDto>> => {
  const params = converterDtoParaQueryString(filtro);
  const url = `/api/v1/item?${params.toString()}`;
  return api.get<PaginacaoDto<ItemListagemDto>>(url).then(response => response.data);
}

export default { 
  obterListaItens,
};