import produce from 'immer';

import { SetMatrizAtual, typeSetMatrizAtual } from './actions';

export interface MatrizProps {
    legadoId: any,
    descricao:any,
    criadoEm: any,
    alteradoEm: any,
    codigo:  any,
    modelo: any,
    status : any,
    disciplinaId :any;
    id :any,
}

const initialValues = {
    id :null,
    legadoId: null,
    descricao:null,
    criadoEm: null,
    alteradoEm: null,
    codigo:  null,
    modelo: null,
    disciplinaId: null,
    status : null,   
};

const Matriz = (state: MatrizProps = initialValues, action: SetMatrizAtual) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetMatrizAtual:
        draft.id = action.payload.id;
        draft.codigo = action.payload.codigo;
        draft.descricao = action.payload.descricao;
        draft.legadoId = action.payload.legadoId;
        draft.status = action.payload.status;
        draft.modelo = action.payload.modelo;
        draft.disciplinaId = action.payload.disciplinaId,
        draft.criadoEm = action.payload.criadoEm;
        draft.alteradoEm = action.payload.alteradoEm;
        break;
      default:
        break;
    }
  });
};

export default Matriz;
