import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { Col, Form, FormProps, Row, Radio, Spin } from 'antd';
import SelectForm from '~/components/select-form';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { ComponentesItemProps } from '~/redux/modules/cadastro-item/item/reducers';
import { DefaultOptionType } from 'antd/lib/select';
import { CheckboxOptionType } from 'antd/es/checkbox/Group';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { setComponentesItem } from '~/redux/modules/cadastro-item/item/actions';
import { SelectValueType } from '~/domain/type/select';
import { validarCampoForm, converterListaParaCheckboxOption } from '~/utils/funcoes';
import { CampoNumero } from '~/components/campo-numero';
import './tabComponentesItemStyles.css';
import { SpanInfoEstatisticas, Separador } from '~/components/configuracao-item/campos/elementos';

const ComponentesItem: React.FC<FormProps> = ({ form }) => {

    const dispatch = useDispatch();
    const item = useSelector((state: AppState) => state.item);
    const componentesItem = useSelector((state: AppState) => state.componentesItem);

    const campoCompetencia = Campos.competencia;
    const campoHabilidade = Campos.habilidade;
    const campoAnoMatriz = Campos.anoMatriz;
    const campoDificuldadeSugerida = Campos.dificuldadeSugerida;

    const campoDiscriminacao = Campos.discriminacao;
    const lblCampoDiscriminacao: React.ReactNode = <>Discriminação{SpanInfoEstatisticas}</>;
    const campoDificuldade = Campos.dificuldade;
    const lblCampoDificuldade: React.ReactNode = <>Dificuldade{SpanInfoEstatisticas}</>;
    const campoAcertoCasual = Campos.acertoCasual;
    const lblCampoAcertoCasual: React.ReactNode = <>Acerto casual{SpanInfoEstatisticas}</>;

    const matrizIdForm = Form.useWatch(Campos.matriz, form);
    const competenciaIdForm = Form.useWatch(Campos.competencia, form);
    const anoMatrizForm = Form.useWatch(campoAnoMatriz, form);
    const dificuldadeSugeridaForm = Form.useWatch(campoDificuldadeSugerida, form);
    const habilidadeForm = Form.useWatch(campoHabilidade, form);

    const discriminacaoForm = Form.useWatch(campoDiscriminacao, form);
    const dificuldadeForm = Form.useWatch(campoDificuldade, form);
    const acertoCasualForm = Form.useWatch(campoAcertoCasual, form);

    const [objTabComponentesItem, setObjTabComponentesItem] =
        useState<ComponentesItemProps>(componentesItem);
    const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
    const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);
    const [listaAnosMatriz, setListaAnosMatriz] = useState<CheckboxOptionType[]>([]);
    const [carregandoDificuldadeSugerida, setCarregandoDificuldadeSugerida] = useState<boolean>(false);
    const [listaDificuldadeSugerida, setListaDificuldadeSugerida] = useState<CheckboxOptionType[]>(
        []
    );
    const [discriminacao, setDiscriminacao] = useState<string>('');
    const [dificuldade, setDificuldade] = useState<string>('');
    const [acertoCasual, setAcertoCasual] = useState<string>('');

    const obterListaDificuldadeSugerida = useCallback(async () => {
        setCarregandoDificuldadeSugerida(true);
        const resposta = await configuracaoItemService.obterDificuldadeSugerida();
        if (resposta?.length) {
            setListaDificuldadeSugerida(converterListaParaCheckboxOption(resposta));
            if (resposta.length === 1) form?.setFieldValue(campoDificuldadeSugerida, resposta[0].value);
            setCarregandoDificuldadeSugerida(false);
        } else {
            setListaDificuldadeSugerida([]);
            form?.setFieldValue(campoDificuldadeSugerida, null);
            setCarregandoDificuldadeSugerida(false);
        }
    }, [form, setListaDificuldadeSugerida, campoDificuldadeSugerida]);


    const popularCampoSelectForm = useCallback(
        async (
            param: SelectValueType,
            nomeCampo: Campos,
            setLista: Dispatch<SetStateAction<DefaultOptionType[]>>,
        ) => {

            let resposta: DefaultOptionType[] = [];
            switch (nomeCampo) {
                case Campos.competencia:
                    if (!param || param == null || param == undefined) return [];
                    resposta = await configuracaoItemService.obterCompetenciasMatriz(param);
                    break;
                case Campos.habilidade:
                    if (!param || param == null || param == undefined) return [];
                    resposta = await configuracaoItemService.obterHabilidadesCompetencia(param);
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

        }, [form]);

    const obterAnosMatriz = useCallback(async () => {
        if (!matrizIdForm || matrizIdForm == null || matrizIdForm == undefined) {
            setListaAnosMatriz([]);
            return false;
        }
        const resposta = await configuracaoItemService.obterAnosMatriz(matrizIdForm);
        if (resposta?.length) {
            setListaAnosMatriz(converterListaParaCheckboxOption(resposta));
            if (resposta.length === 1) form?.setFieldValue(campoAnoMatriz, resposta[0].value);
        } else {
            setListaAnosMatriz([]);
            form?.setFieldValue(campoAnoMatriz, null);
        }
    }, [form, matrizIdForm, campoAnoMatriz]);

    useEffect(() => {
        obterListaDificuldadeSugerida();
    }, [obterListaDificuldadeSugerida]);

    useEffect(() => {
        popularCampoSelectForm(matrizIdForm, campoCompetencia, setListaCompetencias);
        obterAnosMatriz();
    }, [matrizIdForm, campoCompetencia, popularCampoSelectForm, obterAnosMatriz]);

    useEffect(() => {
        popularCampoSelectForm(competenciaIdForm, campoHabilidade, setListaHabilidades);
    }, [competenciaIdForm, campoHabilidade, item, dispatch, popularCampoSelectForm]);

    useEffect(() => {
        const novoObj: ComponentesItemProps = {
            competencia: competenciaIdForm,
            habilidade: habilidadeForm,
            anoMatriz: anoMatrizForm,
            dificuldadeSugerida: dificuldadeSugeridaForm,
            discriminacao: discriminacaoForm,
            dificuldade: dificuldadeForm,
            acertoCasual: acertoCasualForm,
        };
        setObjTabComponentesItem(novoObj);
    }, [
        competenciaIdForm,
        anoMatrizForm,
        dificuldadeSugeridaForm,
        habilidadeForm,
        discriminacaoForm,
        dificuldadeForm,
        acertoCasualForm,
    ]);

    useEffect(() => {
        dispatch(setComponentesItem(objTabComponentesItem));
    }, [objTabComponentesItem, dispatch]);

    return (
        <>
            <Row gutter={10}>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaCompetencias}
                        nomeCampo={campoCompetencia}
                        label={'Competência'}
                        campoObrigatorio={true}
                    ></SelectForm>
                </Col>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaHabilidades}
                        nomeCampo={campoHabilidade}
                        label={'Habilidade'}
                        campoObrigatorio={true}
                    ></SelectForm>
                </Col>
                <Col span={8}>
                </Col>
            </Row>
            <Separador />
            <Row gutter={10}>
                <Col span={8}>
                    <Form.Item
                        label='Selecione o ano'
                        name={campoAnoMatriz}
                        rules={[
                            {
                                required: validarCampoForm(anoMatrizForm),
                                message: 'Campo obrigatório',
                            }
                        ]}>
                        <Radio.Group options={listaAnosMatriz} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={10}>
                <Col span={10}>
                    <Form.Item
                        label='Dificuldade sugerida'
                        name={campoDificuldadeSugerida}
                        rules={[
                            {
                                required: validarCampoForm(dificuldadeSugeridaForm),
                                message: 'Campo obrigatório',
                            }
                        ]}>
                        <Spin size='small' spinning={carregandoDificuldadeSugerida}>
                            <Radio.Group
                                className='dificuldadeSugerida'
                                id='rblDificuldadeSugerida'
                                buttonStyle='solid'
                                optionType='button'
                                options={listaDificuldadeSugerida}
                            />
                        </Spin>
                    </Form.Item>
                </Col>
            </Row>
            <Separador />
            <Row gutter={10}>
                <h3>
                    <b>Informações estatísticas</b>
                </h3>
            </Row>
            <Row gutter={10}>
                <Col span={8}>
                    <Form.Item
                        label={lblCampoDiscriminacao}
                        name={campoDiscriminacao}
                        rules={[
                            {
                                required: validarCampoForm(discriminacaoForm),
                                message: 'Campo obrigatório',
                            }
                        ]}
                    >
                        <CampoNumero value={discriminacao} onChange={setDiscriminacao} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label={lblCampoDificuldade}
                        name={campoDificuldade}
                        rules={[{ required: validarCampoForm(dificuldadeForm), message: 'Campo obrigatório' }]}
                    >
                        <CampoNumero value={dificuldade} onChange={setDificuldade} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label={lblCampoAcertoCasual}
                        name={campoAcertoCasual}
                        rules={[{ required: validarCampoForm(acertoCasualForm), message: 'Campo obrigatório' }]}
                    >
                        <CampoNumero value={acertoCasual} onChange={setAcertoCasual} />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};

export default ComponentesItem;
