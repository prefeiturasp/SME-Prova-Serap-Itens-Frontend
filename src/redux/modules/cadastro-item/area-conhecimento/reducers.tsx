import { DefaultOptionType } from 'antd/lib/select';
import produce from 'immer';
import { SelectValueType } from '~/domain/type/select';

import { SetAreaAtual, typeSetAreaAtual } from './actions';

export interface AreaConhecimentoProps {
    legadoId: any,
    descricao:any,
    criadoEm: any,
    alteradoEm: any,
    codigo:  any,
    status : any,
    id :any,
}

const initialValues = {
    legadoId: null,
    descricao:null,
    criadoEm: null,
    alteradoEm: null,
    codigo:  null,
    status : null,
    id :null,
};

const AreaConhecimento = (state: AreaConhecimentoProps = initialValues, action: SetAreaAtual) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetAreaAtual:
        draft.id = action.payload.id;
        draft.codigo = action.payload.codigo;
        draft.descricao = action.payload.descricao;
        draft.legadoId = action.payload.legadoId;
        draft.status = action.payload.status;
        draft.criadoEm = action.payload.criadoEm;
        draft.alteradoEm = action.payload.alteradoEm;
        break;
      default:
        break;
    }
  });
};

export default AreaConhecimento;
