import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { CheckboxOptionType, Col, Form, FormProps, Radio, Row, Spin } from "antd";
import SelectForm from "~/components/select-form";
import { converterListaParaCheckboxOption, ruleCampoObrigatorioForm, validarCampoForm } from "~/utils/funcoes";
import configuracaoItemService from "~/services/configuracaoItem-service";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { DefaultOptionType } from "antd/es/select";
import TipoItem from "~/components/cadastro-item/campos/tipo-item";
import { NivelItem } from "~/domain/enums/nivelItem";
import "./caracteristicaItemComponent.css"
import { SelectValueType } from "~/domain/type/select";


const CaracteristicasItemComponent: React.FC<FormProps> = ({ form }) => {

    const campoDificuldadeSugerida = Campos.dificuldadeSugerida;
    const campoQuantidadeAlternativas = Campos.quantidadeAlternativas;
    const campoSituacaoItem = Campos.situacaoItem;
    const campoTipoItem = Campos.tipoItem;
    const campoNivelItem = Campos.nivelItem;


    const dificuldadeSugeridaIdForm = Form.useWatch(campoDificuldadeSugerida, form);
    const nivelItemIdForm = Form.useWatch(campoNivelItem, form);
    const quantidadeAlternativasForm = Form.useWatch(campoQuantidadeAlternativas, form);


    const [listaDificuldadeSugerida, setListaDificuldadeSugerida] = useState<CheckboxOptionType[]>([]);
    const [carregandoDificuldadeSugerida, setCarregandoDificuldadeSugerida] = useState<boolean>(false);

    const [listaNivelItem, setListaNivelItem] = useState<DefaultOptionType[]>([]);

    const [listaQuantidadeAlternativas, setListaQuantidadeAlternativas] = useState<DefaultOptionType[]>([]);

    const [listaTiposItem, setListaTiposItem] = useState<DefaultOptionType[]>([]);
    const [listaSituacoesItem, setListaSituacoesItem] = useState<DefaultOptionType[]>([]);

    const popularCampoSelectForm = useCallback(
        async (
            param: SelectValueType,
            nomeCampo: Campos,
            setLista: Dispatch<SetStateAction<DefaultOptionType[]>>,
        ) => {

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

            if (resposta?.length) {
                setLista(resposta);
                if (resposta.length === 1) {
                    if (Campos.quantidadeAlternativas === nomeCampo) {
                        form?.setFieldValue(nomeCampo, resposta[0]);
                    } else {
                        form?.setFieldValue(nomeCampo, resposta[0]?.value);
                    }
                }
            } else {
                setLista([]);
                form?.setFieldValue(nomeCampo, null);
            }
        },
        [form],
    );

    useEffect(() => {
        popularCampoSelectForm(nivelItemIdForm, campoQuantidadeAlternativas, setListaQuantidadeAlternativas);
    }, [nivelItemIdForm, campoQuantidadeAlternativas, popularCampoSelectForm]);

    useEffect(() => {
        const opcoes = gerarOpcoesEnum(NivelItem);
        setListaNivelItem(opcoes);
    }, []);

    useEffect(() => {
        popularCampoSelectForm(null, campoTipoItem, setListaTiposItem);
    }, [campoQuantidadeAlternativas, campoTipoItem, popularCampoSelectForm]);

    useEffect(() => {
        popularCampoSelectForm(null, campoSituacaoItem, setListaSituacoesItem);
    }, [popularCampoSelectForm, campoSituacaoItem]);



    const obterListaDificuldadeSugerida = useCallback(async () => {
        setCarregandoDificuldadeSugerida(true);
        const resposta = await configuracaoItemService.obterDificuldadeSugerida();
        console.log('resposta dificuldade sugerida', resposta);
        if (resposta?.length > 0) {
            console.log('Entrou no IF');
            setListaDificuldadeSugerida(converterListaParaCheckboxOption(resposta));
            if (resposta.length === 1) {
                console.log('Selecionando único item', resposta[0]);
                form?.setFieldValue(campoDificuldadeSugerida, resposta[0].value);
            } else {
                const primeiroItem = resposta[0];
                console.log('primeiroItem', primeiroItem);
                if (primeiroItem?.descricao?.includes("1 - Muito Fácil")) {
                    console.log('Selecionando primeiro item porque é "1 - Muito Fácil"');
                    form?.setFieldValue(campoDificuldadeSugerida, primeiroItem.value);
                }
            }
            setCarregandoDificuldadeSugerida(false);
        } else {
            console.log('Entrou no ELSE');
            setListaDificuldadeSugerida([]);
            form?.setFieldValue(campoDificuldadeSugerida, null);
            setCarregandoDificuldadeSugerida(false);
        }
    }, [form, setListaDificuldadeSugerida, campoDificuldadeSugerida]);

    useEffect(() => {
        obterListaDificuldadeSugerida();
    }, [obterListaDificuldadeSugerida]);

    useEffect(() => {
        if (listaDificuldadeSugerida.length > 0) {
            form?.setFieldValue(campoDificuldadeSugerida, listaDificuldadeSugerida[0].value);
        }
    }, [listaDificuldadeSugerida, campoDificuldadeSugerida, form]);



    const gerarOpcoesEnum = (enumObj: Record<string, string | number>) => {
        return Object.entries(enumObj)
            .filter(([_, value]) => typeof value === "number")
            .map(([key, value]) => ({
                label: <span style={{ color: "#595959" }}>{key.replace(/([A-Z])/g, " $1").trim()}</span>,
                value,
            }));
    };

    return (
        <>
            <div className='card'>
                <div className='card-titulo'>
                    Características do item
                </div>
                <div className='card-subtitulo'>
                    Configure as propriedades técnicas do item
                </div>
                <div className='card-corpo'>
                    <Row>
                        <Col xs={24} md={12} className='card-campo'>
                            <Form.Item
                                label='Dificuldade sugerida'
                                name={campoDificuldadeSugerida}
                                rules={ruleCampoObrigatorioForm(dificuldadeSugeridaIdForm)}>
                                <Spin size='small' spinning={carregandoDificuldadeSugerida}>
                                    <Radio.Group
                                        className='dificuldadeSugeridaCadastroItem'
                                        id='rblDificuldadeSugerida'
                                        buttonStyle='solid'
                                        optionType='button'
                                        options={listaDificuldadeSugerida}
                                    />
                                </Spin>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaNivelItem}
                                nomeCampo={campoNivelItem}
                                label={'Nível do Item'}
                                campoObrigatorio={false}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaQuantidadeAlternativas}
                                nomeCampo={campoQuantidadeAlternativas}
                                label="Categoria do item e quantidade de alternativas*"
                                campoObrigatorio={true}
                                disabled={!nivelItemIdForm}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={12} className='card-campo'>
                            <TipoItem
                                form={form}
                                options={listaTiposItem}
                                campoObrigatorio={true}
                                disabled={!quantidadeAlternativasForm}
                            />
                            <div className="caracteristicasItemTexto">
                                <p><b>Observação:</b> Dicotômico apresenta apenas duas opções (certo/errado).
                                    Politômico apresenta várias opções com graus de resposta (classificações ou níveis).
                                </p>
                            </div>
                        </Col>
                        <Col xs={24} md={12} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaSituacoesItem}
                                nomeCampo={campoSituacaoItem}
                                label={'Situação do item'}
                                campoObrigatorio={true}
                            ></SelectForm>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} className='card-campo'>

                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default CaracteristicasItemComponent;
