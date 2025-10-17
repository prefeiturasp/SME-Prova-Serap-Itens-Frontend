import { Col, Form, FormProps, notification, Row, Spin } from "antd";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons";

//css
import './cadastrarItemNovo.css';

const CadastrarItemNovoElaboracao: React.FC<FormProps> = ({form}) => {
    const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";

    const [carregando, setCarregando] = useState<boolean>(false);

    type tipoMsg = 'success' | 'info' | 'warning' | 'error';
    const [api, contextHolder] = notification.useNotification();
    const mensagem = useCallback(
            async (tipo: tipoMsg, titulo: string, msg: string) => {
                api[tipo]({ message: titulo, description: msg });
            },
            [api],
        );

    const initialValuesForm = {}

  return (
    <>
            <Spin size='small'
                spinning={carregando}
            >
                {contextHolder}

                <Form
                    className='form'
                    form={form}
                    layout='vertical'
                    autoComplete='off'
                    initialValues={initialValuesForm}
                    style={{
                        margin: 0,
                    }}
                >
                    {/* <Affix offsetTop={0.1} style={{ marginBottom: 30 }}> */}
                    <div className='cadastrarItemHeader'>
                        <Row className="cadastrarItemHeader-corpo">
                            <Col xs={12} md={6}>
                                <Link to={linkRetorno} className="cadastrarItemHeader-retornar">
                                    <ArrowLeftOutlined className="cadastrarItemHeader-icone-retornar" />
                                    <span className="cadastrarItemHeader-texto-retornar">Retornar à tela inicial</span>
                                </Link>
                            </Col>
                            <Col xs={12} md={12} className='cadastrarItemHeader-titulo'>
                                Cadastrar novo item
                            </Col>
                            <Col xs={0} md={6} />
                        </Row>
                        <div className='cadastrarItemHeader-rota'>
                            <div className='cadastrarItemHeader-rota-texto'>
                                Home / Itens/ Cadastrar novo item
                            </div>
                            <div className='cadastrarItemHeader-rota-titulo'>
                                Cadastrar novo item
                            </div>
                        </div>
                        <div className='cadastrarItemHeader-Breadcrumb-corpo'>
                            <div className='cadastrarItemHeader-Breadcrumb-item02'>
                                <div className='cadastrarItemHeader-Breadcrumb-item01-index'>
                                    1
                                </div>
                                <div className='cadastrarItemHeader-Breadcrumb-item01-texto'>
                                    Configuração
                                </div>
                            </div>
                            <RightOutlined className='cadastrarItemHeader-Breadcrumb-separator' />
                            <div className='cadastrarItemHeader-Breadcrumb-item01'>
                                <div className='cadastrarItemHeader-Breadcrumb-item02-index'>
                                    2
                                </div>
                                <div className='cadastrarItemHeader-Breadcrumb-item02-texto'>
                                    Elaboração do item
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* </Affix> */}

                </Form>
            </Spin>
        </>
  );
};

export default CadastrarItemNovoElaboracao;