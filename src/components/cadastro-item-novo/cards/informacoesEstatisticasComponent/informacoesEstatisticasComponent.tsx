import React, { useEffect, useState } from "react";
import { Col, Form, FormProps, Row } from "antd";
import { Campos } from "~/domain/enums/campos-cadastro-item";
import { CampoNumero } from "~/components/cadastro-item/campo-numero";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "~/redux";
import { ConfiguracaoItemNovoProps } from "~/redux/modules/cadastroItem-novo/itemNovo/reducers";
import { setConfiguracaoItemNovo } from "~/redux/modules/cadastroItem-novo/itemNovo/actions";


const InformacoesEstatisticasComponent: React.FC<FormProps> = ({ form }) => {


    const campoDiscriminacao = Campos.discriminacao;
    const campoDificuldade = Campos.dificuldade;
    const campoAcertoCasual = Campos.acertoCasual;
    const campoParametroBTransformado = Campos.parametroBTransformado;
    const campoMediaDesvioPadrao = Campos.mediaDesvioPadrao;

    const discriminacaoForm = Form.useWatch(campoDiscriminacao, form);
    const dificuldadeForm = Form.useWatch(campoDificuldade, form);
    const acertoCasualForm = Form.useWatch(campoAcertoCasual, form);
    const parametroBTransformadoForm = Form.useWatch(campoParametroBTransformado, form);
    const mediaDesvioPadraoForm = Form.useWatch(campoMediaDesvioPadrao, form);

    //redux
    const dispatch = useDispatch();
    const configuracaoItemNovo = useSelector((state: AppState) => state.configuracaoItemNovo);
    const [objTabConfiguracaoItemNovo, setObjTabConfiguracaoItemNovo] =
        useState<Partial<ConfiguracaoItemNovoProps>>({});
    //fim redux

    const [discriminacao, setDiscriminacao] = useState<string>('');
    const [dificuldade, setDificuldade] = useState<string>('');
    const [acertoCasual, setAcertoCasual] = useState<string>('');
    const [parametroBTransformado, setParametroBTransformado] = useState<string>('');
    const [mediaDesvioPadrao, setMediaDesvioPadrao] = useState<string>('');

    //redux
    useEffect(() => {
        const novoObj: Partial<ConfiguracaoItemNovoProps> = {
            discriminacao: discriminacaoForm,
            dificuldade: dificuldadeForm,
            acertoCasual: acertoCasualForm,
            parametroBTransformado: parametroBTransformadoForm,
            mediaDesvioPadrao: mediaDesvioPadraoForm,
        }
        setObjTabConfiguracaoItemNovo(novoObj);
    }, [
        configuracaoItemNovo,
        discriminacaoForm,
        dificuldadeForm,
        acertoCasualForm,
        parametroBTransformadoForm,
        mediaDesvioPadraoForm,
    ]);

    useEffect(() => {
        dispatch(setConfiguracaoItemNovo(objTabConfiguracaoItemNovo));
    }, [objTabConfiguracaoItemNovo, dispatch]);
    //fim redux



    return (
        <>
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
                                    value={discriminacao}
                                    onChange={setDiscriminacao}
                                    placeholder='Exemplo: 1'
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8} className='card-campo'>
                            <Form.Item
                                label='Dificuldade'
                                name={campoDificuldade}
                            >
                                <CampoNumero
                                    value={dificuldade}
                                    onChange={setDificuldade}
                                    placeholder='Exemplo: 2'
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8} className='card-campo'>
                            <Form.Item
                                label='Acerto casual'
                                name={campoAcertoCasual}
                            >
                                <CampoNumero
                                    value={acertoCasual}
                                    onChange={setAcertoCasual}
                                    placeholder='Exemplo: 3'
                                />
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
                                    value={parametroBTransformado}
                                    onChange={setParametroBTransformado}
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
                                {/* <Input /> */}
                                <CampoNumero
                                    value={mediaDesvioPadrao}
                                    onChange={setMediaDesvioPadrao}
                                    placeholder='Exemplo: 5'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default InformacoesEstatisticasComponent;