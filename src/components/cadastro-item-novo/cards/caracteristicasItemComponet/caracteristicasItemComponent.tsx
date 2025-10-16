import React, { useCallback, useEffect, useState } from "react";
import { CheckboxOptionType, Col, Form, FormProps, Radio, Row, Spin } from "antd";
import SelectForm from "~/components/select-form";
import { converterListaParaCheckboxOption, ruleCampoObrigatorioForm } from "~/utils/funcoes";
import configuracaoItemService from "~/services/configuracaoItem-service";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { DefaultOptionType } from "antd/es/select";
import TipoItem from "~/components/cadastro-item/campos/tipo-item";
import "./caracteristicaItemComponent.css";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "~/redux";
import { setConfiguracaoItemNovo } from "~/redux/modules/cadastroItem-novo/itemNovo/actions";

const CaracteristicasItemComponent: React.FC<FormProps> = ({ form }) => {
    const campoDificuldadeSugerida = Campos.dificuldadeSugerida;
    const campoQuantidadeAlternativas = Campos.quantidadeAlternativas;
    const campoSituacaoItem = Campos.situacaoItem;
    const campoTipoItem = Campos.tipoItem;
    const campoNivelItem = Campos.nivelItem;

    // Form watchers
    const dificuldadeSugeridaIdForm = Form.useWatch(campoDificuldadeSugerida, form);
    const nivelItemIdForm = Form.useWatch(campoNivelItem, form);
    const quantidadeAlternativasForm = Form.useWatch(campoQuantidadeAlternativas, form);
    const tipoItemIdForm = Form.useWatch(campoTipoItem, form);
    const situacaoItemIdForm = Form.useWatch(campoSituacaoItem, form);

    const [carregandoInicial, setCarregandoInicial] = useState(true);

    // Redux
    const dispatch = useDispatch();
    const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);

    // Estados locais
    const [listaDificuldadeSugerida, setListaDificuldadeSugerida] = useState<CheckboxOptionType[]>([]);
    const [carregandoDificuldadeSugerida, setCarregandoDificuldadeSugerida] = useState<boolean>(false);
    const [listaNivelItem, setListaNivelItem] = useState<DefaultOptionType[]>([]);
    const [listaQuantidadeAlternativas, setListaQuantidadeAlternativas] = useState<DefaultOptionType[]>([]);
    const [listaTiposItem, setListaTiposItem] = useState<DefaultOptionType[]>([]);
    const [listaSituacoesItem, setListaSituacoesItem] = useState<DefaultOptionType[]>([]);

    // Utilitário para gerar selects
    const popularCampoSelectForm = useCallback(
        async (nomeCampo: Campos, setLista: React.Dispatch<React.SetStateAction<DefaultOptionType[]>>) => {
            let resposta: DefaultOptionType[] = [];

            switch (nomeCampo) {
                case Campos.quantidadeAlternativas:
                    resposta = await configuracaoItemService.obterQuantidadeAlternativas();                    
                    break;
                case Campos.tipoItem:
                    resposta = await configuracaoItemService.obterTiposItem();
                    break;
                case Campos.situacaoItem:
                    resposta = await configuracaoItemService.obterSituacoesItem();
                    break;
                default:
                    break;
            }

            setLista(resposta || []);

            if (nomeCampo === campoQuantidadeAlternativas) {
                if (resposta.length === 1) {
                    console.log('setando quantidade alternativas padrao', resposta[0]);
                    form?.setFieldValue(campoQuantidadeAlternativas, resposta[0].value);
                }
            }
        },
        [form],
    );

    // Dificuldade sugerida
    const obterListaDificuldadeSugerida = useCallback(async () => {
        setCarregandoDificuldadeSugerida(true);
        const resposta = await configuracaoItemService.obterDificuldadeSugerida();

        if (resposta?.length > 0) {
            setListaDificuldadeSugerida(converterListaParaCheckboxOption(resposta));

            // Define valor padrão
            const primeiroItem = resposta.find(r => r.descricao?.includes("1 - Muito Fácil")) || resposta[0];
            form?.setFieldValue(campoDificuldadeSugerida, primeiroItem);
            console.log('primeiroItem', primeiroItem);
        } else {
            setListaDificuldadeSugerida([]);
            form?.setFieldValue(campoDificuldadeSugerida, null);
        }

        setCarregandoDificuldadeSugerida(false);
    }, [form, campoDificuldadeSugerida]);

    // nivelitems
    const obterListaNivelItem = useCallback(async () => {
        setCarregandoDificuldadeSugerida(true);
        const resposta = await configuracaoItemService.obterNivelItem();
        if (resposta?.length > 0) {
            setListaNivelItem(resposta);
        } else {
            setListaNivelItem([]);
            form?.setFieldValue(campoNivelItem, null);
        }
        setCarregandoDificuldadeSugerida(false);
    }, [form, campoNivelItem]);

    // Carrega selects e listas iniciais
    useEffect(() => {
        const carregarDados = async () => {
            obterListaDificuldadeSugerida();
            obterListaNivelItem();
            popularCampoSelectForm(campoQuantidadeAlternativas, setListaQuantidadeAlternativas);
            popularCampoSelectForm(campoTipoItem, setListaTiposItem);
            popularCampoSelectForm(campoSituacaoItem, setListaSituacoesItem);
            setCarregandoInicial(false);
        };
        carregarDados();
        console.log('useEffect de carregamento inicial executado');

    }, []);


    useEffect(() => {
        
        if (carregandoInicial) return;

        console.log('dificuldadeSugeridaIdForm passando valor', dificuldadeSugeridaIdForm);
        console.log('QUANTIDADE', form?.getFieldValue(campoQuantidadeAlternativas));

        var quantidadeAlternativasValor = form?.getFieldValue(campoQuantidadeAlternativas)?.value;
        if (quantidadeAlternativasValor) {
            console.log('@fez dispach de quantidadeAlternativas', quantidadeAlternativasValor);
            dispatch(
            setConfiguracaoItemNovo({
                ...configuracaoItemNovo,
                quantidadeAlternativas: quantidadeAlternativasValor,
            }),
        );}

        // var dificuldadeSugerida = form?.getFieldValue(campoDificuldadeSugerida)?.value;
        // if (dificuldadeSugerida) {
        //     console.log('@fez dispach de dificuldadeSugerida', dificuldadeSugerida.toString());
        //     dispatch(
        //     setConfiguracaoItemNovo({
        //         ...configuracaoItemNovo,
        //         dificuldadeSugerida: dificuldadeSugerida,
        //     }));
        // }else{
        //     dispatch(
        //     setConfiguracaoItemNovo({
        //         ...configuracaoItemNovo,
        //         dificuldadeSugerida: 5,
        //     }));
        // }


        dispatch(
            setConfiguracaoItemNovo({
                ...configuracaoItemNovo,
                dificuldadeSugerida: dificuldadeSugeridaIdForm ? Number(dificuldadeSugeridaIdForm) : "5",
                nivelItem: form?.getFieldValue(campoNivelItem)?.value ?? form?.getFieldValue(campoNivelItem),
                //quantidadeAlternativas: form?.getFieldValue(campoQuantidadeAlternativas)?.valor ? form?.getFieldValue(campoQuantidadeAlternativas): 1,
                tipoItem: form?.getFieldValue(campoTipoItem)?.valor ?? form?.getFieldValue(campoTipoItem),
                situacaoItem: form?.getFieldValue(campoSituacaoItem)?.valor ?? form?.getFieldValue(campoSituacaoItem),
            }),
        );
    }, [
        dificuldadeSugeridaIdForm,
        nivelItemIdForm,
        quantidadeAlternativasForm,
        tipoItemIdForm,
        situacaoItemIdForm,
        dispatch,
        carregandoInicial,
    ]);

    return (
        <div className="card">
            <div className="card-titulo">Características do item</div>
            <div className="card-subtitulo">Configure as propriedades técnicas do item</div>
            <div className="card-corpo">
                <Row>
                    <Col xs={24} md={12} className="card-campo">
                        <Form.Item
                            label="Dificuldade sugerida"
                            name={campoDificuldadeSugerida}
                            rules={ruleCampoObrigatorioForm(dificuldadeSugeridaIdForm)}
                        >
                            <Spin size="small" spinning={carregandoDificuldadeSugerida}>
                                <Radio.Group
                                    className="dificuldadeSugeridaCadastroItem"
                                    id="rblDificuldadeSugerida"
                                    buttonStyle="solid"
                                    optionType="button"
                                    options={listaDificuldadeSugerida}
                                    defaultValue={5}
                                />
                            </Spin>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12} className="card-campo">
                        <SelectForm
                            form={form}
                            options={listaNivelItem}
                            nomeCampo={campoNivelItem}
                            label="Nível do Item"
                            campoObrigatorio={false}
                            labelInValue={true}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col xs={24} md={24} className="card-campo">
                        <SelectForm
                            form={form}
                            options={listaQuantidadeAlternativas}
                            nomeCampo={campoQuantidadeAlternativas}
                            label="Categoria do item e quantidade de alternativas*"
                            campoObrigatorio={true}
                            disabled={!nivelItemIdForm}
                            labelInValue={true}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col xs={24} md={12} className="card-campo">
                        <TipoItem
                            form={form}
                            options={listaTiposItem}
                            campoObrigatorio={true}
                            disabled={!quantidadeAlternativasForm}
                        />
                        <div className="caracteristicasItemTexto">
                            <p>
                                <b>Observação:</b> Dicotômico apresenta apenas duas opções (certo/errado).<br />
                                Politômico apresenta várias opções com graus de resposta (classificações ou níveis).
                            </p>
                        </div>
                    </Col>

                    <Col xs={24} md={12} className="card-campo">
                        <SelectForm
                            form={form}
                            options={listaSituacoesItem}
                            nomeCampo={campoSituacaoItem}
                            label="Situação do item"
                            campoObrigatorio={true}
                            labelInValue={true}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CaracteristicasItemComponent;
