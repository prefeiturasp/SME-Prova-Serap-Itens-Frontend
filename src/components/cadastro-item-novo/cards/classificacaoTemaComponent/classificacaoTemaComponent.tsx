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


const ClassificacaoTemaComponent: React.FC<FormProps> = ({ form }) => {

    const campoAssunto = Campos.assunto;
    const campoSubAssunto = Campos.subAssunto;
    const campoPalavraChave = Campos.palavraChave;
    const campoSentencaDescritora = Campos.sentencaDescritora;
    const campoObservacao = Campos.observacao;


    const assuntoIdForm = Form.useWatch(campoAssunto, form);
    const palavrasChaveForm = Form.useWatch(campoPalavraChave, form);
    const disciplinaidForm = Form.useWatch(Campos.disciplinas, form);

    const [listaAssuntos, setListaAssuntos] = useState<DefaultOptionType[]>([]);
    const [listaSubAssuntos, setListaSubAssuntos] = useState<DefaultOptionType[]>([]);
    const [palavrasChave, setPalavrasChave] = useState<string[] | undefined>([]);

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


    const obterAssuntos = useCallback(() => {
        popularCampoSelectForm(disciplinaidForm, campoAssunto, setListaAssuntos);
    }, [popularCampoSelectForm, campoAssunto, disciplinaidForm]);

    useEffect(() => {
        obterAssuntos();
    }, [disciplinaidForm, obterAssuntos]);

    useEffect(() => {
        popularCampoSelectForm(assuntoIdForm, campoSubAssunto, setListaSubAssuntos);
    }, [assuntoIdForm, campoSubAssunto, popularCampoSelectForm]);
    

    return (
        <>
            <div className='card'>
                <div className='card-titulo'>
                    Classificação por tema
                </div>
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
                            ></SelectForm>
                        </Col>
                        <Col xs={24} md={8} className='card-campo'>
                            <SelectForm
                                form={form}
                                options={listaSubAssuntos}
                                nomeCampo={campoSubAssunto}
                                label={'Subassunto'}
                                campoObrigatorio={false}
                                disabled={!assuntoIdForm}
                            ></SelectForm>
                        </Col>
                        <Col xs={24} md={8} className='card-campo'>
                            <Form.Item
                                label='Palavra-chave'
                                name={campoPalavraChave}
                                rules={ruleCampoArrayStringObrigatorioForm(palavrasChaveForm)}
                            >
                                <InputTag valueForm={palavrasChaveForm} tags={palavrasChave} setTags={setPalavrasChave} />
                            </Form.Item>
                            <div className="caracteristicasItemTexto">
                                <p>Separe as palavras-chave usando vírgula.</p>
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
                                    maxLength={100} />
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
}

export default ClassificacaoTemaComponent;