import React, { useCallback, useEffect, useState } from "react";
import { CheckboxOptionType, Col, Form, FormProps, Radio, Row, Spin } from "antd";
import SelectForm from "~/components/select-form";
import { converterListaParaCheckboxOption, ruleCampoObrigatorioForm } from "~/utils/funcoes";
import configuracaoItemService from "~/services/configuracaoItem-service";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { DefaultOptionType } from "antd/es/select";
import TipoItem from "~/components/cadastro-item/campos/tipo-item";
import { NivelItem } from "~/domain/enums/nivelItem";
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

        if (resposta?.length > 0) {
            setListaDificuldadeSugerida(converterListaParaCheckboxOption(resposta));

            // Define valor padrão
            const primeiroItem = resposta.find(r => r.descricao?.includes("1 - Muito Fácil")) || resposta[0];
            form?.setFieldValue(campoDificuldadeSugerida, primeiroItem.value);
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
        console.log('resposta nivel item', resposta);
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

        // const opcoesNivel = Object.entries(NivelItem)
        //     .filter(([_, value]) => typeof value === "number")
        //     .map(([key, value]) => ({
        //         label: <span style={{ color: "#595959" }}>{key.replace(/([A-Z])/g, " $1").trim()}</span>,
        //         value,
        //     }));
        // setListaNivelItem(opcoesNivel);
    }, [obterListaDificuldadeSugerida, popularCampoSelectForm, campoQuantidadeAlternativas, campoTipoItem, campoSituacaoItem]);

    // 🔹 Atualiza Redux direto (padrão novo)
    useEffect(() => {
        dispatch(
            setConfiguracaoItemNovo({
                ...configuracaoItemNovo,
                dificuldadeSugerida: dificuldadeSugeridaIdForm ? Number(dificuldadeSugeridaIdForm) : null,
                nivelItem: form?.getFieldValue(campoNivelItem)?.value ?? form?.getFieldValue(campoNivelItem),
                quantidadeAlternativas: form?.getFieldValue(campoQuantidadeAlternativas)?.valor ?? form?.getFieldValue(campoQuantidadeAlternativas),
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
