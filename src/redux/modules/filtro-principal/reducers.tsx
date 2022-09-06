import { DefaultOptionType } from 'antd/lib/select';
import produce from 'immer';
import { SelectValueType } from '~/domain/type/select';

import { SetFiltroAtual, typeSetFiltroAtual } from './actions';

export interface FiltroPrincipalProps {
  anoLetivo: SelectValueType;
  situacaoProva: SelectValueType;
  prova: SelectValueType[];
  modalidade: SelectValueType;
  dre: SelectValueType;
  ue: SelectValueType;
  anoEscolar: SelectValueType;
  turma: SelectValueType;
  anosLetivos: DefaultOptionType[];
  situacoesProvas: DefaultOptionType[];
  provas: DefaultOptionType[];
  modalidades: DefaultOptionType[];
  dres: DefaultOptionType[];
  ues: DefaultOptionType[];
  anosEscolares: DefaultOptionType[];
  turmas: DefaultOptionType[];
}

const initialValues = {
  anoLetivo: null,
  situacaoProva: null,
  prova: [],
  modalidade: null,
  dre: null,
  ue: null,
  anoEscolar: null,
  turma: null,
  anosLetivos: [],
  situacoesProvas: [],
  provas: [],
  modalidades: [],
  dres: [],
  ues: [],
  anosEscolares: [],
  turmas: [],
};

const filtroPrincipal = (state: FiltroPrincipalProps = initialValues, action: SetFiltroAtual) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetFiltroAtual:
        draft.anoLetivo = action.payload.anoLetivo;
        draft.situacaoProva = action.payload.situacaoProva;
        draft.prova = action.payload.prova;
        draft.modalidade = action.payload.modalidade;
        draft.dre = action.payload.dre;
        draft.ue = action.payload.ue;
        draft.anoEscolar = action.payload.anoEscolar;
        draft.turma = action.payload.turma;
        draft.anosLetivos = action.payload.anosLetivos;
        draft.situacoesProvas = action.payload.situacoesProvas;
        draft.provas = action.payload.provas;
        draft.modalidades = action.payload.modalidades;
        draft.dres = action.payload.dres;
        draft.ues = action.payload.ues;
        draft.anosEscolares = action.payload.anosEscolares;
        draft.turmas = action.payload.turmas;
        break;
      default:
        break;
    }
  });
};

export default filtroPrincipal;
