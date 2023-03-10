import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { Col, Form, FormProps, Row, Radio, Spin, Input } from 'antd';
import SelectForm from '~/components/select-form';
import { Campos } from '~/domain/enums/campos-cadastro-item';
import { ComponentesItemProps } from '~/redux/modules/cadastro-item/item/reducers';
import { DefaultOptionType } from 'antd/lib/select';
import { CheckboxOptionType } from 'antd/es/checkbox/Group';
import configuracaoItemService from '~/services/configuracaoItem-service';
import { setComponentesItem } from '~/redux/modules/cadastro-item/item/actions';
import { SelectValueType } from '~/domain/type/select';
import {
    validarCampoForm,
    ruleCampoArrayStringObrigatorioForm,
    ruleCampoObrigatorioForm,
    converterListaParaCheckboxOption,
} from '~/utils/funcoes';
import { CampoNumero } from '~/components/cadastro-item/campo-numero';
import './tabComponentesItemStyles.css';
import { Separador } from '~/components/cadastro-item/elementos';
import TipoItem from '~/components/cadastro-item/campos/tipo-item';
import InputTag from '~/components/input-tag';

const ComponentesItem: React.FC<FormProps> = ({ form }) => {

    const dispatch = useDispatch();
    const { TextArea } = Input;
    const componentesItem = useSelector((state: AppState) => state.componentesItem);

    const campoCompetencia = Campos.competencia;
    const campoHabilidade = Campos.habilidade;
    const campoAnoMatriz = Campos.anoMatriz;
    const campoDificuldadeSugerida = Campos.dificuldadeSugerida;
    const campoAssunto = Campos.assunto;
    const campoSubAssunto = Campos.subAssunto;
    const campoSituacaoItem = Campos.situacaoItem;
    const campoTipoItem = Campos.tipoItem;
    const campoQuantidadeAlternativas = Campos.quantidadeAlternativas;

    const campoDiscriminacao = Campos.discriminacao;
    const campoDificuldade = Campos.dificuldade;
    const campoAcertoCasual = Campos.acertoCasual;
    const campoPalavraChave = Campos.palavraChave;
    const campoParametroBTransformado = Campos.parametroBTransformado;
    const campoMediaDesvioPadrao = Campos.mediaDesvioPadrao;
    const campoObservacao = Campos.observacao;

    const matrizIdForm = Form.useWatch(Campos.matriz, form);
    const competenciaIdForm = Form.useWatch(Campos.competencia, form);
    const anoMatrizIdForm = Form.useWatch(campoAnoMatriz, form);

    const assuntoIdForm = Form.useWatch(campoAssunto, form);
    const subAssuntoIdForm = Form.useWatch(campoSubAssunto, form);
    const situacaoItemIdForm = Form.useWatch(campoSituacaoItem, form);
    const tipoItemIdForm = Form.useWatch(campoTipoItem, form);
    const quantidadeAlternativasIdForm = Form.useWatch(campoQuantidadeAlternativas, form);

    const dificuldadeSugeridaIdForm = Form.useWatch(campoDificuldadeSugerida, form);
    const habilidadeIdForm = Form.useWatch(campoHabilidade, form);

    const discriminacaoForm = Form.useWatch(campoDiscriminacao, form);
    const dificuldadeForm = Form.useWatch(campoDificuldade, form);
    const acertoCasualForm = Form.useWatch(campoAcertoCasual, form);

    const palavrasChaveForm = Form.useWatch(campoPalavraChave, form);
    const parametroBTransformadoForm = Form.useWatch(campoParametroBTransformado, form);
    const mediaDesvioPadraoForm = Form.useWatch(campoMediaDesvioPadrao, form);
    const observacaoForm = Form.useWatch(campoObservacao, form);

    const [objTabComponentesItem, setObjTabComponentesItem] =
        useState<ComponentesItemProps>(componentesItem);
    const [listaCompetencias, setListaCompetencias] = useState<DefaultOptionType[]>([]);
    const [listaHabilidades, setListaHabilidades] = useState<DefaultOptionType[]>([]);
    const [listaAnosMatriz, setListaAnosMatriz] = useState<DefaultOptionType[]>([]);

    const [listaAssuntos, setListaAssuntos] = useState<DefaultOptionType[]>([]);
    const [listaSubAssuntos, setListaSubAssuntos] = useState<DefaultOptionType[]>([]);
    const [listaSituacoesItem, setListaSituacoesItem] = useState<DefaultOptionType[]>([]);
    const [listaQuantidadeAlternativas, setListaQuantidadeAlternativas] = useState<
        DefaultOptionType[]
    >([]);

    const [carregandoDificuldadeSugerida, setCarregandoDificuldadeSugerida] =
        useState<boolean>(false);
    const [listaDificuldadeSugerida, setListaDificuldadeSugerida] = useState<CheckboxOptionType[]>(
        []
    );
    const [listaTiposItem, setListaTiposItem] = useState<DefaultOptionType[]>([]);

    const [discriminacao, setDiscriminacao] = useState<string>('');
    const [dificuldade, setDificuldade] = useState<string>('');
    const [acertoCasual, setAcertoCasual] = useState<string>('');
    const [palavrasChave, setPalavrasChave] = useState<string[] | undefined>([]);
    const [parametroBTransformado, setParametroBTransformado] = useState<string>('');

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
            const parametroValido = !validarCampoForm(param);
            switch (nomeCampo) {
                case Campos.competencia:
                    if (parametroValido)
                        resposta = await configuracaoItemService.obterCompetenciasMatriz(param);
                    break;
                case Campos.habilidade:
                    if (parametroValido)
                        resposta = await configuracaoItemService.obterHabilidadesCompetencia(param);
                    break;
                case Campos.assunto:
                    resposta = await configuracaoItemService.obterAssuntos();
                    break;
                case Campos.subAssunto:
                    if (parametroValido)
                        resposta = await configuracaoItemService.obterSubAssuntos(param);
                    break;
                case Campos.situacaoItem:
                    resposta = await configuracaoItemService.obterSituacoesItem();
                    break;
                case Campos.tipoItem:
                    resposta = await configuracaoItemService.obterTiposItem();
                    break;
                case Campos.quantidadeAlternativas:
                    resposta = await configuracaoItemService.obterQuantidadeAlternativas();
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

    const obterTiposItem = useCallback(() => {
        popularCampoSelectForm(null, campoTipoItem, setListaTiposItem);
    }, [popularCampoSelectForm, campoTipoItem]);

    const obterAssuntos = useCallback(() => {
        popularCampoSelectForm(null, campoAssunto, setListaAssuntos);
    }, [popularCampoSelectForm, campoAssunto]);

    const obterSituacoesItem = useCallback(() => {
        popularCampoSelectForm(null, campoSituacaoItem, setListaSituacoesItem);
    }, [popularCampoSelectForm, campoSituacaoItem]);

    const obterQuantidadeAlternativas = useCallback(() => {
        popularCampoSelectForm(null, campoQuantidadeAlternativas, setListaQuantidadeAlternativas);
    }, [popularCampoSelectForm, campoQuantidadeAlternativas]);

    useEffect(() => {
        obterTiposItem();
        obterAssuntos();
        obterSituacoesItem();
        obterQuantidadeAlternativas();
    }, [obterTiposItem, obterAssuntos, obterSituacoesItem, obterQuantidadeAlternativas]);

    useEffect(() => {
        obterListaDificuldadeSugerida();
    }, [obterListaDificuldadeSugerida]);

    useEffect(() => {
        popularCampoSelectForm(matrizIdForm, campoCompetencia, setListaCompetencias);
        obterAnosMatriz();
    }, [matrizIdForm, campoCompetencia, popularCampoSelectForm, obterAnosMatriz]);

    useEffect(() => {
        popularCampoSelectForm(competenciaIdForm, campoHabilidade, setListaHabilidades);
    }, [competenciaIdForm, campoHabilidade, popularCampoSelectForm]);

    useEffect(() => {
        popularCampoSelectForm(assuntoIdForm, campoSubAssunto, setListaSubAssuntos);
    }, [assuntoIdForm, campoSubAssunto, popularCampoSelectForm]);

    useEffect(() => {
        form?.setFieldValue(campoPalavraChave, palavrasChave);
    }, [form, palavrasChave, campoPalavraChave]);

    useEffect(() => {
        const novoObj: ComponentesItemProps = {
            competencia: competenciaIdForm,
            habilidade: habilidadeIdForm,
            anoMatriz: anoMatrizIdForm,
            assunto: assuntoIdForm,
            subAssunto: subAssuntoIdForm,
            situacaoItem: situacaoItemIdForm,
            tipoItem: tipoItemIdForm,
            quantidadeAlternativas: quantidadeAlternativasIdForm,
            dificuldadeSugerida: dificuldadeSugeridaIdForm,
            discriminacao: discriminacaoForm,
            dificuldade: dificuldadeForm,
            acertoCasual: acertoCasualForm,
            palavrasChave: palavrasChaveForm,
            parametroBTransformado: parametroBTransformadoForm,
            mediaDesvioPadrao: mediaDesvioPadraoForm,
            observacao: observacaoForm,
        };
        setObjTabComponentesItem(novoObj);
    }, [
        competenciaIdForm,
        anoMatrizIdForm,
        assuntoIdForm,
        subAssuntoIdForm,
        situacaoItemIdForm,
        tipoItemIdForm,
        quantidadeAlternativasIdForm,
        dificuldadeSugeridaIdForm,
        habilidadeIdForm,
        discriminacaoForm,
        dificuldadeForm,
        acertoCasualForm,
        palavrasChaveForm,
        parametroBTransformadoForm,
        mediaDesvioPadraoForm,
        observacaoForm,
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
                    <SelectForm
                        form={form}
                        options={listaAnosMatriz}
                        nomeCampo={campoAnoMatriz}
                        label={'Selecione o ano'}
                        campoObrigatorio={true}
                    ></SelectForm>
                </Col>
            </Row>
            <Row gutter={10}>
                <Col span={10}>
                    <Form.Item
                        label='Dificuldade sugerida'
                        name={campoDificuldadeSugerida}
                        rules={ruleCampoObrigatorioForm(dificuldadeSugeridaIdForm)}>
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
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaAssuntos}
                        nomeCampo={campoAssunto}
                        label={'Assunto'}
                        campoObrigatorio={false}
                    ></SelectForm>
                </Col>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaSubAssuntos}
                        nomeCampo={campoSubAssunto}
                        label={'Sub-Assunto'}
                        campoObrigatorio={false}
                    ></SelectForm>
                </Col>
            </Row>
            <Separador />
            <Row gutter={10}>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaSituacoesItem}
                        nomeCampo={campoSituacaoItem}
                        label={'Situação do Item'}
                        campoObrigatorio={true}
                    ></SelectForm>
                </Col>
                <Col span={8}>
                    <TipoItem form={form} options={listaTiposItem} />
                </Col>
                <Col span={8}>
                    <SelectForm
                        form={form}
                        options={listaQuantidadeAlternativas}
                        nomeCampo={campoQuantidadeAlternativas}
                        label={'Quantidade de alternativas / categorias'}
                        campoObrigatorio={true}
                    ></SelectForm>
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
                        label='Discriminação'
                        name={campoDiscriminacao}
                    >
                        <CampoNumero value={discriminacao} onChange={setDiscriminacao} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label='Dificuldade'
                        name={campoDificuldade}
                    >
                        <CampoNumero value={dificuldade} onChange={setDificuldade} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label='Acerto casual'
                        name={campoAcertoCasual}
                    >
                        <CampoNumero value={acertoCasual} onChange={setAcertoCasual} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={10}>
                <Col span={8}>
                    <Form.Item
                        label='Parâmetro b transformado'
                        name={campoParametroBTransformado}
                    >
                        <CampoNumero value={parametroBTransformado} onChange={setParametroBTransformado} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label='Média e Desvio Padrão'
                        name={campoMediaDesvioPadrao}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Separador />
            <Row gutter={10}>
                <Col span={8}>
                    <Form.Item
                        label='Palavra-chave'
                        name={campoPalavraChave}
                        rules={ruleCampoArrayStringObrigatorioForm(palavrasChaveForm)}
                    >
                        <InputTag valueForm={palavrasChaveForm} tags={palavrasChave} setTags={setPalavrasChave} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={10}>
                <Col span={8}>
                    <Form.Item
                        label='Observação'
                        name={campoObservacao}
                    >
                        <TextArea rows={4} placeholder="Até 100 caracteres" maxLength={100} />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};

export default ComponentesItem;
