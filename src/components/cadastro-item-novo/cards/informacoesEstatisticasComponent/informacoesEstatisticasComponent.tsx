import React from "react";
import { Col, Form, Row } from "antd";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { CampoNumero } from "~/components/cadastro-item/campo-numero";

interface Props {
  form: any;
  cardName: string;
}

const InformacoesEstatisticasComponent= ({ form, cardName }: Props) => {

    // Campos
    const campoDiscriminacao = Campos.discriminacao;
    const campoDificuldade = Campos.dificuldade;
    const campoAcertoCasual = Campos.acertoCasual;
    const campoParametroBTransformado = Campos.parametroBTransformado;
    const campoMediaDesvioPadrao = Campos.mediaDesvioPadrao;

   

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
                            name={[cardName, campoDiscriminacao]}
                        >
                            <CampoNumero
                                value={form?.getFieldValue([cardName, campoDiscriminacao])}
                                onChange={(valor) => form?.setFieldValue([cardName, campoDiscriminacao], valor)}
                                placeholder='Exemplo: 1' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8} className='card-campo'>
                        <Form.Item
                            label='Dificuldade'
                            name={[cardName, campoDificuldade]}
                        >
                            <CampoNumero
                                value={form?.getFieldValue([cardName, campoDificuldade])}
                                onChange={(valor) => form?.setFieldValue([cardName, campoDificuldade], valor)}
                                placeholder='Exemplo: 2' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8} className='card-campo'>
                        <Form.Item
                            label='Acerto casual'
                            name={[cardName, campoAcertoCasual]}
                        >
                            <CampoNumero
                                value={form?.getFieldValue([cardName, campoAcertoCasual])}
                                onChange={(valor) => form?.setFieldValue([cardName, campoAcertoCasual], valor)}
                                placeholder='Exemplo: 3' />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24} md={12} className='card-campo'>
                        <Form.Item
                            label='Parâmetro b transformado'
                            name={[cardName, campoParametroBTransformado]}
                        >
                            <CampoNumero
                                value={form?.getFieldValue([cardName, campoParametroBTransformado])}
                                onChange={(valor) => form?.setFieldValue([cardName, campoParametroBTransformado], valor)}
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
                            name={[cardName, campoMediaDesvioPadrao]}
                        >
                            <CampoNumero
                                value={form?.getFieldValue([cardName, campoMediaDesvioPadrao])}
                                onChange={(valor) => form?.setFieldValue([cardName, campoMediaDesvioPadrao], valor)}
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
