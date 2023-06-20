import produce from 'immer';
import { SetDisciplinaAtual, typeSetDisciplinaAtual } from './actions';

export interface DisciplinaProps {
    id: any;
    legadoId: any;
    descricao: any;
    nivelEnsino: any;
    criadoEm: any;
    alteradoEm: any;
    codigo: any;
    areaConhecimentoId: any;
    status: any;
}

const initialValues = {
    id: null,
    legadoId: null,
    descricao: null,
    nivelEnsino: null,
    criadoEm: null,
    alteradoEm: null,
    codigo: null,
    areaConhecimentoId: null,
    status: null,
};

const Disciplina = (state: DisciplinaProps = initialValues, action: SetDisciplinaAtual) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case typeSetDisciplinaAtual:
                draft.id = action.payload.id;
                draft.legadoId = action.payload.legadoId;
                draft.descricao = action.payload.descricao;
                draft.nivelEnsino = action.payload.nivelEnsino;
                draft.criadoEm = action.payload.criadoEm;
                draft.alteradoEm = action.payload.alteradoEm;
                draft.codigo = action.payload.codigo;
                draft.areaConhecimentoId = action.payload.areaConhecimentoId;
                draft.status = action.payload.status;
                break;
            default:
                break;
        }
    });
};

export default Disciplina;
