import { DefaultOptionType } from 'antd/lib/select';
import api from './api';
import { SelectValueType } from '~/domain/type/select';
import geralService from '~/services/geral-service';
import { MatrizObj } from '~/components/configuracao-item/modelo-matriz';
import { AxiosResponse } from 'axios';
import { DisciplinaProps } from '~/redux/modules/cadastro-item/disciplina/reducers';
import { ItemDto } from '~/domain/dto/item-dto';
const URL_DEFAULT = '/api/v1';

const obterAreaConhecimento = (): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/areaConhecimento`);

const obterDisciplinas = (idAreaConhecimento: SelectValueType): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/disciplina/areaconhecimento/${idAreaConhecimento}`);

const obterMatriz = (disciplinaId: SelectValueType): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/matriz/disciplina/${disciplinaId}`);

const obterModeloMatriz = (matrizId: SelectValueType): Promise<AxiosResponse<MatrizObj>> =>
  api.get(`${URL_DEFAULT}/matriz/${matrizId}`);

const obterNivelEnsino = (disciplinaId: SelectValueType): Promise<AxiosResponse<DisciplinaProps>> =>
  api.get(`${URL_DEFAULT}/disciplina/${disciplinaId}`);

const salvarItem = (item: ItemDto): Promise<AxiosResponse<number>> =>
  api.post(`${URL_DEFAULT}/Item/salvar`, item);

const salvarRascunhoItem = (item: ItemDto): Promise<AxiosResponse<number>> =>
  api.post(`${URL_DEFAULT}/Item/salvar-rascunho`, item);

const obterCompetenciasMatriz = (matrizId: SelectValueType): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/competencia/matriz/${matrizId}`);

const obterHabilidadesCompetencia = (
  competenciaId: SelectValueType,
): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/habilidade/competencia/${competenciaId}`);

const obterAnosMatriz = (matrizId: SelectValueType): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/tipograde/matriz/${matrizId}`);

const obterDificuldadeSugerida = (): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/dificuldade`);

const obterItem = (id: number): Promise<AxiosResponse<any>> => api.get(`${URL_DEFAULT}/Item/${id}`);

export default {
  obterAreaConhecimento,
  obterDisciplinas,
  obterMatriz,
  obterModeloMatriz,
  obterNivelEnsino,
  salvarItem,
  salvarRascunhoItem,
  obterItem,
  obterCompetenciasMatriz,
  obterHabilidadesCompetencia,
  obterAnosMatriz,
  obterDificuldadeSugerida,
};
