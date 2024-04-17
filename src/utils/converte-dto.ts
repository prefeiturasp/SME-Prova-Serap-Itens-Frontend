import { DefaultOptionType } from 'antd/lib/select';
import { SelecioneDto } from '~/domain/dto/selecione-dto';

export const converterSelecineDto = (dto: SelecioneDto[]): DefaultOptionType[] => {
  return dto.map((item) => ({
    ...item,
    value: item.valor,
    label: item.descricao,
  }));
};

export const voltarAoSerap = () => {
  sessionStorage.removeItem('persist:SERAP-ITEM-PERSIST');
  const URL_SERAP = import.meta.env.VITE_SME_SERAP;
  window.location.replace(URL_SERAP);
};
