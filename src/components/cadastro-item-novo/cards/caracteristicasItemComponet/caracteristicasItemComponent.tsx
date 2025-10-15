import React, { useCallback, useEffect, useState } from "react";
import { CheckboxOptionType, Col, Form, Radio, Row, Spin } from "antd";
import SelectForm from "~/components/select-form";
import { converterListaParaCheckboxOption, ruleCampoObrigatorioForm } from "~/utils/funcoes";
import configuracaoItemService from "~/services/configuracaoItem-service";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { DefaultOptionType } from "antd/es/select";
import TipoItem from "~/components/cadastro-item/campos/tipo-item";

interface Props {
    form: any;
    cardName: string;
}

const CaracteristicasItemComponent = ({ form, cardName }: Props) => {
    const campoDificuldadeSugerida = Campos.dificuldadeSugerida;
    const campoQuantidadeAlternativas = Campos.quantidadeAlternativas;
    const campoSituacaoItem = Campos.situacaoItem;
    const campoTipoItem = Campos.tipoItem;
    const campoNivelItem = Campos.nivelItem;

    // Form watchers
    const dificuldadeSugeridaIdForm = Form.useWatch([cardName, campoDificuldadeSugerida], form);
    const nivelItemIdForm = Form.useWatch([cardName, campoNivelItem], form);
    const quantidadeAlternativasForm = Form.useWatch([cardName, campoQuantidadeAlternativas], form);

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
        
    }, [obterListaDificuldadeSugerida, popularCampoSelectForm, campoQuantidadeAlternativas, campoTipoItem, campoSituacaoItem]);

    
    return (
        <div className="card">
            <div className="card-titulo">Características do item</div>
            <div className="card-subtitulo">Configure as propriedades técnicas do item</div>

            <div className="card-corpo">
                <Row>
                    <Col xs={24} md={12} className="card-campo">
                        <Form.Item
                            label="Dificuldade sugerida"
                            name={[cardName, campoDificuldadeSugerida]}
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
                            nomeCampo={[cardName, campoNivelItem]}
                            label="Nível do Item"
                            campoObrigatorio={false}
                            labelInValue={false}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col xs={24} md={24} className="card-campo">
                        <SelectForm
                            form={form}
                            options={listaQuantidadeAlternativas}
                            nomeCampo={[cardName, campoQuantidadeAlternativas]}
                            label="Categoria do item e quantidade de alternativas*"
                            campoObrigatorio={true}
                            disabled={!nivelItemIdForm}
                            labelInValue={false}
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
                            nomeCampo={[cardName, campoTipoItem]}
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
                            nomeCampo={[cardName, campoSituacaoItem]}
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
