import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Col, Form, FormProps, Row } from "antd";
import SelectForm from "~/components/select-form";
import InputTag from "~/components/input-tag";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { DefaultOptionType } from "antd/es/select";
import TextArea from "antd/es/input/TextArea";
import { ruleCampoArrayStringObrigatorioForm, validarCampoForm } from "~/utils/funcoes";
import configuracaoItemService from "~/services/configuracaoItem-service";
import { SelectValueType } from "~/domain/type/select";
import { useDispatch, useSelector } from "react-redux";
import { setConfiguracaoItemNovo } from "~/redux/modules/cadastroItem-novo/itemNovo/actions";
import { AppState } from "~/redux";

const ClassificacaoTemaComponent: React.FC<FormProps> = ({ form }) => {

    const campoAssunto = Campos.assunto;
    const campoSubAssunto = Campos.subAssunto;
    const campoPalavraChave = Campos.palavraChave;
    const campoSentencaDescritora = Campos.sentencaDescritora;
    const campoObservacao = Campos.observacao;

    // Campos observados
    const assuntoIdForm = Form.useWatch(campoAssunto, form);
    const subAssuntoIdForm = Form.useWatch(campoSubAssunto, form);
    const palavrasChaveForm = Form.useWatch(campoPalavraChave, form);
    const disciplinaidForm = Form.useWatch(Campos.disciplinas, form);
    const sentencaDescritoraForm = Form.useWatch(campoSentencaDescritora, form);
    const observacaoForm = Form.useWatch(campoObservacao, form);

    const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);

    const dispatch = useDispatch();

    const [listaAssuntos, setListaAssuntos] = useState<DefaultOptionType[]>([]);
    const [listaSubAssuntos, setListaSubAssuntos] = useState<DefaultOptionType[]>([]);
    const [palavrasChave] = useState<string[] | undefined>([]);

    // 🔹 Função genérica para popular selects
    const popularCampoSelectForm = useCallback(
        async (
            param: SelectValueType,
            nomeCampo: Campos,
            setLista: Dispatch<SetStateAction<DefaultOptionType[]>>,
        ) => {
            let resposta: DefaultOptionType[] = [];
            const parametroValido = !validarCampoForm(param);

            switch (nomeCampo) {
                case Campos.assunto:
                    if (parametroValido)
                        resposta = await configuracaoItemService.obterAssuntos(param);
                    break;
                case Campos.subAssunto:
                    if (parametroValido)
                        resposta = await configuracaoItemService.obterSubAssuntos(param);
                    break;
                default:
                    break;
            }

            if (resposta?.length) {
                setLista(resposta);
                if (resposta.length === 1) {
                    form?.setFieldValue(nomeCampo, resposta[0]?.value);
                }
            } else {
                setLista([]);
                form?.setFieldValue(nomeCampo, null);
            }
        },
        [form],
    );

    // 🔹 Atualiza listas conforme dependências
    useEffect(() => {
        if (disciplinaidForm)
            popularCampoSelectForm(disciplinaidForm, campoAssunto, setListaAssuntos);
    }, [disciplinaidForm, popularCampoSelectForm, campoAssunto]);

    useEffect(() => {
        if (assuntoIdForm)
            popularCampoSelectForm(assuntoIdForm, campoSubAssunto, setListaSubAssuntos);
    }, [assuntoIdForm, popularCampoSelectForm, campoSubAssunto]);

    // 🔹 Atualiza form de palavra-chave ao digitar
    useEffect(() => {
        form?.setFieldValue(campoPalavraChave, palavrasChave);
    }, [form, palavrasChave, campoPalavraChave]);

    // 🔹 Redux - sincroniza estado do card
    useEffect(() => {
        dispatch(
            setConfiguracaoItemNovo({
                ...configuracaoItemNovo,
                assunto: form?.getFieldValue(campoAssunto)?.valor ?? form?.getFieldValue(campoAssunto),
                subAssunto: form?.getFieldValue(campoSubAssunto)?.valor ?? form?.getFieldValue(campoSubAssunto),
                palavrasChave: form?.getFieldValue(campoPalavraChave)?.valor ?? form?.getFieldValue(campoPalavraChave),
                sentencaDescritora: form?.getFieldValue(campoSentencaDescritora)?.valor ?? form?.getFieldValue(campoSentencaDescritora),
                observacao: form?.getFieldValue(campoObservacao)?.valor ?? form?.getFieldValue(campoObservacao),
            }),
        );
    }, [
        dispatch,
        assuntoIdForm,
        subAssuntoIdForm,
        palavrasChaveForm,
        sentencaDescritoraForm,
        observacaoForm,
    ]);

    return (
        <>
            <div className='card'>
                <div className='card-titulo'>Classificação por tema</div>
                <div className='card-subtitulo'>
                    Organize o item por assuntos e palavras-chave para facilitar a busca
                </div>
                <div className='card-corpo'>
                    <Row>
                        <Col xs={24} md={8} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaAssuntos}
                                nomeCampo={campoAssunto}
                                label={'Assunto'}
                                campoObrigatorio={false}
                                disabled={!disciplinaidForm}
                                labelInValue={true}
                            />
                        </Col>
                        <Col xs={24} md={8} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaSubAssuntos}
                                nomeCampo={campoSubAssunto}
                                label={'Subassunto'}
                                campoObrigatorio={false}
                                disabled={!assuntoIdForm}
                                labelInValue={true}
                            />
                        </Col>
                        <Col xs={24} md={8} className='card-campo'>
                            <Form.Item
                                label='Palavra-chave'
                                name={campoPalavraChave}
                                rules={ruleCampoArrayStringObrigatorioForm(form?.getFieldValue(campoPalavraChave))}
                            >
                                <InputTag
                                    valueForm={form?.getFieldValue(campoPalavraChave)}
                                    tags={form?.getFieldValue(campoPalavraChave)}
                                    setTags={(v) => form?.setFieldValue(campoPalavraChave, v)}
                                />
                            </Form.Item>
                            <div className="caracteristicasItemTexto">
                                <p>Digite uma palavra e pressione “Enter” para adicioná-la.</p>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={24} md={12} className='card-campo'>
                            <Form.Item
                                label='Sentença Descritora'
                                name={campoSentencaDescritora}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Descreva a habilidade ou competência específica avaliada pelo item..."
                                    maxLength={100}
                                />
                            </Form.Item>
                            <div className="caracteristicasItemTexto">
                                <p>Insira até 100 caracteres</p>
                            </div>
                        </Col>

                        <Col xs={24} md={12} className='card-campo'>
                            <Form.Item
                                label='Observação'
                                name={campoObservacao}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Adicione observações sobre a questão, orientações para aplicação ou outras informações importantes..."
                                    maxLength={100}
                                />
                            </Form.Item>
                            <div className="caracteristicasItemTexto">
                                <p>Insira até 100 caracteres</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default ClassificacaoTemaComponent;
