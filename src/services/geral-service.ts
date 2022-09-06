import { DefaultOptionType } from 'antd/lib/select';
import { AxiosResponse } from 'axios';
import { CardTotalizador } from '~/components/cards-totalizadores';
import { SelecioneDto } from '~/domain/dto/selecione-dto';
import { FiltroPrincipalProps } from '~/redux/modules/filtro-principal/reducers';
import { converterSelecineDto } from '~/utils/converte-dto';
import queryString from 'query-string';

import api from './api';

const URL_DEFAULT = '/api/v1/totalizadores';

const obterDadosCardsTotalizadores = (
  filtros: FiltroPrincipalProps,
): Promise<AxiosResponse<CardTotalizador[]>> => {
  const params = {
    anoLetivo: filtros.anoLetivo,
    modalidade: filtros.modalidade,
    dreId: filtros.dre,
    ueId: filtros.ue,
    anoEscolar: filtros.anoEscolar,
    turmaId: filtros.turma,
    provasId: filtros.prova,
    provaSituacao: filtros.situacaoProva,
  };
  return api.get(URL_DEFAULT, {
    params,
    paramsSerializer(params) {
      return queryString.stringify(params, {
        skipEmptyString: true,
        skipNull: true,
      });
    },
  });
};

const obterTiposVisualizacoesDados = (): Promise<AxiosResponse> | any => {
  const mock: Array<any> = [
    {
      value: 1,
      label: 'Dados Acumulados',
    },
    {
      value: 2,
      label: 'Dados de Hoje',
    },
    {
      value: 3,
      label: 'Dados da Semana',
    },
    {
      value: 4,
      label: 'Dados do Mês',
    },
  ];
  return new Promise((resolve) => resolve({ data: mock }));
};

const getDefaultSelect = (url: string): Promise<DefaultOptionType[]> =>
  api
    .get<SelecioneDto[]>(url)
    .catch((e) => e)
    .then((resposta: AxiosResponse) => {
      if (resposta?.data?.length) {
        return converterSelecineDto(resposta.data);
      }
      return [];
    });

export default {
  obterDadosCardsTotalizadores,
  obterTiposVisualizacoesDados,
  getDefaultSelect,
};
