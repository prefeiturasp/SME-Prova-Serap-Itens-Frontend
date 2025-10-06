
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Col, Form, FormProps, Row } from 'antd';
import './identificacaoComponent.css';
import SelectForm from '~/components/select-form';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { DefaultOptionType } from 'antd/lib/select';
import { SelectValueType } from '~/domain/type/select';
import configuracaoItemService from '~/services/configuracaoItem-service';

//verificar se é possivel reaproveitar esse redux dentro do novo contexto de pagina, porq a tab morreu.
import { ConfiguracaoItemProps } from '~/redux/modules/cadastro-item/item/reducers';
import { setConfiguracaoItem } from '~/redux/modules/cadastro-item/item/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';


const IdentificacaoComponent: React.FC<FormProps> = ({ form }) => {

    const [listaAreaConhecimento, setListaAreaConhecimento] = useState<DefaultOptionType[]>([]);
    const [listaDisciplinas, setListaDisciplinas] = useState<DefaultOptionType[]>([]);
    const [listaMatriz, setListaMatriz] = useState<DefaultOptionType[]>([]);
    const [listaAnoEscolares, setListaAnoEscolares] = useState<DefaultOptionType[]>([]);

    //verificar se é possivel reaproveitar esse redux dentro do novo contexto de pagina, porq a tab morreu.
    const dispatch = useDispatch();
    const configuracaoItem = useSelector((state: AppState) => state.configuracaoItem);
    const [objTabConfiguracaoItem, setObjTabConfiguracaoItem] =
        useState<ConfiguracaoItemProps>(configuracaoItem);
    //fim verificar se é possivel reaproveitar esse redux dentro do novo contexto de pagina, porq a tab morreu.

    const areaConhecimentoIdForm = Form.useWatch(Campos.areaConhecimento, form);
    const disciplinaidForm = Form.useWatch(Campos.disciplinas, form);
    const matrizIdForm = Form.useWatch(Campos.matriz, form);

    const campoAreaConhecimento = Campos.areaConhecimento;
    const campoDisciplina = Campos.disciplinas;
    const campoMatriz = Campos.matriz;
    const campoAnoEscolar = Campos.anoEscolar;

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
                    console.log('resposta', resposta);
                    break;
                case Campos.disciplinas:
                    resposta = await configuracaoItemService.obterDisciplinas(param);
                    break;
                case Campos.matriz:
                    resposta = await configuracaoItemService.obterMatriz(param);
                    break;
                case Campos.anoEscolar:
                    resposta = await configuracaoItemService.obterAnoEscolares();
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
        popularCampoSelectForm(disciplinaidForm, campoMatriz, setListaMatriz);
    }, [disciplinaidForm, campoMatriz, popularCampoSelectForm]);

    useEffect(() => {
        popularCampoSelectForm(matrizIdForm, campoAnoEscolar, setListaAnoEscolares);
    }, [matrizIdForm, campoAnoEscolar, popularCampoSelectForm]);


    //verificar se é possivel reaproveitar esse redux dentro do novo contexto de pagina, porq a tab morreu.
    useEffect(() => {
        const novoObj: ConfiguracaoItemProps = {
            codigo: configuracaoItem.codigo,
            areaConhecimento: areaConhecimentoIdForm,
            disciplina: disciplinaidForm,
            matriz: matrizIdForm,
        };
        setObjTabConfiguracaoItem(novoObj);
    }, [disciplinaidForm, areaConhecimentoIdForm, matrizIdForm, configuracaoItem]);

    useEffect(() => {
        dispatch(setConfiguracaoItem(objTabConfiguracaoItem));
    }, [objTabConfiguracaoItem, dispatch]);
    //fim verificar se é possivel reaproveitar esse redux dentro do novo contexto de pagina, porq a tab morreu.

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
                                options={listaAnoEscolares}
                                nomeCampo={campoAnoEscolar}
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