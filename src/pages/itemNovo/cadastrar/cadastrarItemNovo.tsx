import { Affix, Breadcrumb, Col, Form, Row, Spin } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from "@ant-design/icons";
import './cadastrarItemNovo.css';


const CadastrarItemNovo: React.FC = () => {


    const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";

    return (
        <>
            {/* <Spin size='small'
            // spinning={carregando}
            > */}
            {/* {contextHolder} */}

            <Form
                className='form'
                // form={form}
                layout='vertical'
                autoComplete='off'
                // initialValues={initialValuesForm}
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
                        <div className='cadastrarItemHeader-Breadcrumb-item01'>
                            <div className='cadastrarItemHeader-Breadcrumb-item01-index'>
                                1
                            </div>
                            <div className='cadastrarItemHeader-Breadcrumb-item01-texto'>
                                Configuração
                            </div>
                        </div>
                        <p className='cadastrarItemHeader-Breadcrumb-separator'>{'>'}</p>
                        <div className='cadastrarItemHeader-Breadcrumb-item02'>
                            <div className='cadastrarItemHeader-Breadcrumb-item02-index'>
                                2
                            </div>
                            <div className='cadastrarItemHeader-Breadcrumb-item02-texto'>
                                Elaboração do item
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Title>
                            <Row gutter={2}>
                                <Col span={12}>
                                    <h1>Cadastrar novo item</h1>
                                </Col>
                                <Col span={12} style={{ marginTop: 24 }}>
                                    <Row gutter={[8, 8]} justify='end'>
                                        <Col>
                                            <Button onClick={voltar}>Voltar</Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                type='primary'
                                                onClick={() => salvarItem(true)}
                                                disabled={bloquearBtnSalvarRascunho}
                                            >
                                                Salvar rascunho
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                                                {() => {
                                                    const desabilitar =
                                                        bloquearBtnSalvar || bloquearBtnSalvarRascunhoDadosTabElaboracaoItem();

                                                    return (
                                                        <Button
                                                            type='primary'
                                                            onClick={() => salvarItem()}
                                                            disabled={desabilitar}
                                                        >
                                                            Salvar
                                                        </Button>
                                                    );
                                                }}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Title> */}
                {/* </Affix> */}
                {/* <TabForm form={form} /> */}
            </Form>
            {/* </Spin> */}
        </>
    );
}

export default CadastrarItemNovo;

