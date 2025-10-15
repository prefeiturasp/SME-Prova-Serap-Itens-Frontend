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

            if (resposta?.length) {
                if (resposta.length === 1) {
                    form?.setFieldValue(nomeCampo, Campos.quantidadeAlternativas === nomeCampo ? resposta[0] : resposta[0]?.value);
                }
            } else {
                form?.setFieldValue(nomeCampo, null);
            }
        },
        [form],
    );

    // Dificuldade sugerida
    const obterListaDificuldadeSugerida = useCallback(async () => {
        setCarregandoDificuldadeSugerida(true);
        const resposta = await configuracaoItemService.obterDificuldadeSugerida();
        console.log("Resposta dificuldade sugerida:", resposta);
        if (resposta?.length > 0) {
            setListaDificuldadeSugerida(converterListaParaCheckboxOption(resposta));

            // Define valor padrão apenas se o campo estiver vazio
            const valorAtualAPI = form?.getFieldValue(campoDificuldadeSugerida);
            console.log("obterListaDificuldadeSugerida - valor atual:", valorAtualAPI);
            if (!valorAtualAPI) {
                console.log("API: Definindo valor padrão 5 para dificuldade sugerida");
                form?.setFieldValue(campoDificuldadeSugerida, 5);
            }
        }

        setCarregandoDificuldadeSugerida(false);
    }, [form, campoDificuldadeSugerida]);

    // Define valor padrão inicial para dificuldade sugerida
    useEffect(() => {
        const valorAtual = form?.getFieldValue(campoDificuldadeSugerida);
        console.log("useEffect valor padrão - valor atual:", valorAtual);
        if (!valorAtual) {
            console.log("Definindo valor padrão 5 para dificuldade sugerida");
            form?.setFieldValue(campoDificuldadeSugerida, 5);
        }
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
        obterListaDificuldadeSugerida();
        obterListaNivelItem();
        popularCampoSelectForm(campoQuantidadeAlternativas, setListaQuantidadeAlternativas);
        popularCampoSelectForm(campoTipoItem, setListaTiposItem);
        popularCampoSelectForm(campoSituacaoItem, setListaSituacoesItem);

    }, [obterListaDificuldadeSugerida,
        popularCampoSelectForm,
        campoQuantidadeAlternativas,
        campoTipoItem,
        campoSituacaoItem,
        obterListaNivelItem,
        campoDificuldadeSugerida,
        campoNivelItem
    ]);

    // 🔹 Atualiza Redux - SEM incluir configuracaoItemNovo nas dependências
    useEffect(() => {
        console.log("Atualizando Redux - dificuldadeSugerida:", dificuldadeSugeridaIdForm);
        
        dispatch(
            setConfiguracaoItemNovo({
                ...configuracaoItemNovo,
                dificuldadeSugerida: dificuldadeSugeridaIdForm,
                nivelItem: nivelItemIdForm?.value ?? nivelItemIdForm,
                quantidadeAlternativas: quantidadeAlternativasForm?.valor ?? quantidadeAlternativasForm,
                tipoItem: tipoItemIdForm?.valor ?? tipoItemIdForm,
                situacaoItem: situacaoItemIdForm?.valor ?? situacaoItemIdForm,
            }),
        );
    }, [
        dificuldadeSugeridaIdForm,
        nivelItemIdForm,
        quantidadeAlternativasForm,
        tipoItemIdForm,
        situacaoItemIdForm,
        dispatch,
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
                            initialValue={5}
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
