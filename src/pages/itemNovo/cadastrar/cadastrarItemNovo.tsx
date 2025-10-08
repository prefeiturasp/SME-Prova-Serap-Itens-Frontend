import { Col, Form, FormProps, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from "@ant-design/icons";
import './cadastrarItemNovo.css';
import IdentificacaoComponent from '~/components/cadastro-item-novo/cards/identificacaoComponent/identificacaoComponent';
import CompetenciaHabilidade from '~/components/cadastro-item-novo/cards/competenciaHabilidadeComponent/competenciaHabilidadeComponent';
import CaracteristicasItemComponent from '~/components/cadastro-item-novo/cards/caracteristicasItemComponet/caracteristicasItemComponent';


const CadastrarItemNovo: React.FC<FormProps> = () => { 

    const linkRetorno = "https://serap.sme.prefeitura.sp.gov.br/";
    const [form] = Form.useForm();


    return (
        <>
            {/* <Spin size='small'
            // spinning={carregando}
            > */}
            {/* {contextHolder} */}

            <Form
                className='form'
                form={form}
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

                {/* </Affix> */}
                {/* <TabForm form={form} /> */}
                <div className='cadastrarItem-corpo'>
                    <div className='cadastrarItem-titulo-corpo'>
                        <div className='cadastrarItem-titulo'>
                            Configure o novo item
                        </div>
                        <div className='cadastrarItem-subtitulo'>
                            Preencha as informações abaixo para criar e cadastrar um novo item. Esses dados garantem que ele esteja alinhado à matriz de avaliação e possa ser aplicado corretamente.
                        </div>
                    </div>

                    <IdentificacaoComponent form={form} />
                    <CompetenciaHabilidade form={form} />
                    <CaracteristicasItemComponent form={form} />
                </div>
            </Form>
            {/* </Spin> */}
        </>
    );
}

export default CadastrarItemNovo;

