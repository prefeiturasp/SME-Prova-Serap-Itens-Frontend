import React, { useEffect } from "react";
import { Col, Form, FormProps, Row } from "antd";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { CampoNumero } from "~/components/cadastro-item/campo-numero";
import { useDispatch, useSelector } from "react-redux";
import { setConfiguracaoItemNovo } from "~/redux/modules/cadastroItem-novo/itemNovo/actions";
import { AppState } from "~/redux";

const InformacoesEstatisticasComponent: React.FC<FormProps> = ({ form }) => {
    const dispatch = useDispatch();

    // Campos
    const campoDiscriminacao = Campos.discriminacao;
    const campoDificuldade = Campos.dificuldade;
    const campoAcertoCasual = Campos.acertoCasual;
    const campoParametroBTransformado = Campos.parametroBTransformado;
    const campoMediaDesvioPadrao = Campos.mediaDesvioPadrao;

    // Observa os valores do form
    const discriminacaoForm = Form.useWatch(campoDiscriminacao, form);
    const dificuldadeForm = Form.useWatch(campoDificuldade, form);
    const acertoCasualForm = Form.useWatch(campoAcertoCasual, form);
    const parametroBTransformadoForm = Form.useWatch(campoParametroBTransformado, form);
    const mediaDesvioPadraoForm = Form.useWatch(campoMediaDesvioPadrao, form);

    const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);

    // Atualiza Redux automaticamente quando algum campo muda
    useEffect(() => {
        dispatch(
            setConfiguracaoItemNovo({
                ...configuracaoItemNovo,
                discriminacao: form?.getFieldValue(campoDiscriminacao)?.valor ?? form?.getFieldValue(campoDiscriminacao),
                dificuldade: form?.getFieldValue(campoDificuldade)?.valor ?? form?.getFieldValue(campoDificuldade),
                acertoCasual: form?.getFieldValue(campoAcertoCasual)?.valor ?? form?.getFieldValue(campoAcertoCasual),
                parametroBTransformado: form?.getFieldValue(campoParametroBTransformado)?.valor ?? form?.getFieldValue(campoParametroBTransformado),
                mediaDesvioPadrao: form?.getFieldValue(campoMediaDesvioPadrao)?.valor ?? form?.getFieldValue(campoMediaDesvioPadrao),
            })
        );
    }, [
        dispatch,
        discriminacaoForm,
        dificuldadeForm,
        acertoCasualForm,
        parametroBTransformadoForm,
        mediaDesvioPadraoForm,
    ]);

    return (
        <div className='card'>
            <div className='card-titulo'>
                Informações estatísticas
            </div>
            <div className='card-subtitulo'>
                Configure as informações estatísticas do item
            </div>
            <div className='card-corpo'>
                <Row>
                    <Col xs={24} md={8} className='card-campo'>
                        <Form.Item
                            label='Discriminação'
                            name={campoDiscriminacao}
                        >
                            <CampoNumero
                                value={form?.getFieldValue(campoDiscriminacao)}
                                onChange={(valor) => form?.setFieldValue(campoDiscriminacao, valor)}
                                placeholder='Exemplo: 1' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8} className='card-campo'>
                        <Form.Item
                            label='Dificuldade'
                            name={campoDificuldade}
                        >
                            <CampoNumero
                                value={form?.getFieldValue(campoDificuldade)}
                                onChange={(valor) => form?.setFieldValue(campoDificuldade, valor)}
                                placeholder='Exemplo: 2' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8} className='card-campo'>
                        <Form.Item
                            label='Acerto casual'
                            name={campoAcertoCasual}
                        >
                            <CampoNumero
                                value={form?.getFieldValue(campoAcertoCasual)}
                                onChange={(valor) => form?.setFieldValue(campoAcertoCasual, valor)}
                                placeholder='Exemplo: 3' />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24} md={12} className='card-campo'>
                        <Form.Item
                            label='Parâmetro b transformado'
                            name={campoParametroBTransformado}
                        >
                            <CampoNumero
                                value={form?.getFieldValue(campoParametroBTransformado)}
                                onChange={(valor) => form?.setFieldValue(campoParametroBTransformado, valor)}
                                placeholder='Exemplo: 4'
                            />
                        </Form.Item>
                        <div className="caracteristicasItemTexto">
                            <p>
                                Indica em que ponto da escala de proficiência a questão está localizada.
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} md={12} className='card-campo'>
                        <Form.Item
                            label='Média e desvio padrão'
                            name={campoMediaDesvioPadrao}
                        >
                            <CampoNumero
                                value={form?.getFieldValue(campoMediaDesvioPadrao)}
                                onChange={(valor) => form?.setFieldValue(campoMediaDesvioPadrao, valor)}
                                placeholder="Exemplo: 5"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default InformacoesEstatisticasComponent;
