import { DefaultOptionType } from 'antd/lib/select';
import { Modalidade } from '~/domain/enums/modalidade';
import { ProvaSituacao } from '~/domain/enums/prova-situacao';
import { SelectValueType } from '~/domain/type/select';
import geralService from '~/services/geral-service';

const URL_DEFAULT = '/api/v1/filtro';

const obterAnosLetivos = (): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/ano-letivo`);

const obterSituacoes = (): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/situacao`);

const obterProvas = (
  anoLetivo: SelectValueType,
  situacao: ProvaSituacao | SelectValueType,
): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/prova/${anoLetivo}/situacao/${situacao}`);

const obterModalidades = (): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/modalidade`);

const obterDres = (): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/dre`);

const obterUes = (dreId: SelectValueType): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(`${URL_DEFAULT}/ue/${dreId}`);

const obterAnosEscolares = (
  anoLetivo: SelectValueType,
  modalidade: SelectValueType,
  ueId: SelectValueType,
): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(
    `${URL_DEFAULT}/ano/${anoLetivo}/modalidade/${modalidade}/ue/${ueId}`,
  );

const obterTurmas = (
  anoLetivo: SelectValueType,
  ueId: SelectValueType,
  modalidade: Modalidade | SelectValueType,
  anoEscolar: SelectValueType,
): Promise<DefaultOptionType[]> =>
  geralService.getDefaultSelect(
    `${URL_DEFAULT}/turma/${anoLetivo}/modalidade/${modalidade}/ue/${ueId}/ano/${anoEscolar}`,
  );

export default {
  obterAnosLetivos,
  obterSituacoes,
  obterProvas,
  obterModalidades,
  obterDres,
  obterUes,
  obterAnosEscolares,
  obterTurmas,
};
