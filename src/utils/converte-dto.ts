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

export const converterDtoParaQueryString = <T extends Record<string, any>>(dto: T): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(dto).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === '0') return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== '' && v !== '0') {
          params.append(key, String(v));
        }
      });
    } else {
      params.append(key, String(value));
    }
  });

  return params;
};
