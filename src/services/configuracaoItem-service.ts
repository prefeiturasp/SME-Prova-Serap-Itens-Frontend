import { DefaultOptionType } from 'antd/lib/select';
import { SelectValueType } from '~/domain/type/select';
import geralService from '~/services/geral-service';

const URL_DEFAULT = '/api/v1/';

const obterAreaConhecimento = (): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/areaConhecimento`);

const obterDisciplinas = (
idAreaConhecimento:  SelectValueType,

): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/disciplina/areaconhecimento/${idAreaConhecimento}`);

  const obterMatriz = (
    disciplinaId:  SelectValueType,
    ): Promise<DefaultOptionType[]> =>
      geralService.getDefaultSelect(`${URL_DEFAULT}/matriz/disciplina/${disciplinaId}`);
export default {
  obterAreaConhecimento,
  obterDisciplinas,
  obterMatriz
};
