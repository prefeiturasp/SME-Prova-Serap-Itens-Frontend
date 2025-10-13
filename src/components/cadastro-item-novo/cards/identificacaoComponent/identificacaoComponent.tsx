
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Col, Form, FormProps, Row } from 'antd';
import './identificacaoComponent.css';
import SelectForm from '~/components/select-form';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { DefaultOptionType } from 'antd/lib/select';
import { SelectValueType } from '~/domain/type/select';
import configuracaoItemService from '~/services/configuracaoItem-service';

//verificar se é possivel reaproveitar esse redux dentro do novo contexto de pagina, porq a tab morreu.
import { ConfiguracaoItemNovoProps } from '~/redux/modules/cadastroItem-novo/itemNovo/reducers';
import { setConfiguracaoItemNovo } from '~/redux/modules/cadastroItem-novo/itemNovo/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';


const IdentificacaoComponent: React.FC<FormProps> = ({ form }) => {

    const campoAreaConhecimento = Campos.areaConhecimento;
    const campoDisciplina = Campos.disciplinas;
    const campoMatriz = Campos.matriz;
    const campoAnoMatriz = Campos.anoMatriz;

    const areaConhecimentoIdForm = Form.useWatch(Campos.areaConhecimento, form);
    const disciplinaIdForm = Form.useWatch(Campos.disciplinas, form);
    const matrizIdForm = Form.useWatch(Campos.matriz, form);
    const anoMatrizIdForm = Form.useWatch(Campos.anoMatriz, form);

    const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
    const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
    const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);
    const [listaAnosMatriz, setListaAnosMatriz] = useState<DefaultOptionType[]>([]);


    //redux
    const dispatch = useDispatch();
    const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);
    const [objTabConfiguracaoItemNovo, setObjTabConfiguracaoItemNovo] =
        useState<Partial<ConfiguracaoItemNovoProps>>({});
    //fim redux

    const obterAnosMatriz = useCallback(async () => {
        if (!matrizIdForm || matrizIdForm == null || matrizIdForm == undefined) {
            setListaAnosMatriz([]);
            return false;
        }
        const resposta = await configuracaoItemService.obterAnosMatriz(matrizIdForm);
        if (resposta?.length) {
            setListaAnosMatriz(resposta);
            if (resposta.length === 1) form?.setFieldValue(campoAnoMatriz, resposta[0].value);
        } else {
            setListaAnosMatriz([]);
            form?.setFieldValue(campoAnoMatriz, null);
        }
    }, [form, matrizIdForm, campoAnoMatriz]);


    useEffect(() => {
        form?.resetFields();
    }, [form, listaAreaConhecimento]);

    const popularCampoSelectForm = useCallback(
        async (
            param: SelectValueType,
            nomeCampo: Campos,
            setLista: Dispatch<SetStateAction<DefaultOptionType[]>>,
        ) => {

            let resposta: DefaultOptionType[] = [];
            switch (nomeCampo) {
                case Campos.areaConhecimento:
                    resposta = await configuracaoItemService.obterAreaConhecimento();
                    break;
                case Campos.disciplinas:
                    resposta = await configuracaoItemService.obterDisciplinas(param);
                    break;
                case Campos.matriz:
                    resposta = await configuracaoItemService.obterMatriz(param);
                    break;
                default:
                    break;
            }

            if (resposta?.length) {
                setLista(resposta);
                if (resposta.length === 1) form?.setFieldValue(nomeCampo, resposta[0].value);
            } else {
                setLista([]);
                form?.setFieldValue(nomeCampo, null);
            }
        },
        [form],
    );

    const obterAreaConhecimento = useCallback(() => {
        popularCampoSelectForm(null, campoAreaConhecimento, setListaAreaConhecimento);
    }, [campoAreaConhecimento, popularCampoSelectForm]);

    useEffect(() => {
        obterAreaConhecimento();
    }, [obterAreaConhecimento]);

    useEffect(() => {
        popularCampoSelectForm(areaConhecimentoIdForm, campoDisciplina, setListaDisciplinas);
    }, [areaConhecimentoIdForm, campoDisciplina, popularCampoSelectForm]);

    useEffect(() => {
        popularCampoSelectForm(disciplinaIdForm, campoMatriz, setListaMatriz);
    }, [disciplinaIdForm, campoMatriz, popularCampoSelectForm]);

    useEffect(() => {
        obterAnosMatriz();
    }, [matrizIdForm, campoAnoMatriz, obterAnosMatriz]);


    //redux
    useEffect(() => {
        const novoObj: Partial<ConfiguracaoItemNovoProps> = {
            codigo: configuracaoItemNovo.codigo,
            areaConhecimento: areaConhecimentoIdForm,
            disciplina: disciplinaIdForm,
            matriz: matrizIdForm,
            anoMatriz: anoMatrizIdForm,
        }
        setObjTabConfiguracaoItemNovo(novoObj);
    }, [
        configuracaoItemNovo,
        areaConhecimentoIdForm,
        disciplinaIdForm,
        matrizIdForm,
        anoMatrizIdForm,
    ]);

    useEffect(() => {
        dispatch(setConfiguracaoItemNovo(objTabConfiguracaoItemNovo));
    }, [objTabConfiguracaoItemNovo, dispatch]);
    //fim redux



    return (
        <>
            <div className='card'>
                <div className='card-titulo'>
                    Identificação
                </div>
                <div className='card-subtitulo'>
                    Defina a localização desta questão na matriz curricular.
                </div>
                <div className='card-corpo'>
                    <Row>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaAreaConhecimento}
                                nomeCampo={campoAreaConhecimento}
                                label={'Área de conhecimento'}
                                campoObrigatorio={true}
                                disabled={false}
                            />
                        </Col>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaDisciplinas}
                                nomeCampo={campoDisciplina}
                                label={'Componente curricular'}
                                campoObrigatorio={true}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaMatriz}
                                nomeCampo={campoMatriz}
                                label={'Matriz de avaliação'}
                                campoObrigatorio={true}
                            />
                        </Col>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaAnosMatriz}
                                nomeCampo={campoAnoMatriz}
                                label={'Ano (ano escolar)'}
                                campoObrigatorio={true}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default IdentificacaoComponent;
