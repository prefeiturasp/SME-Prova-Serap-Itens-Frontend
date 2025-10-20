import { Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './listagemItens.css';

const ListagemItens: React.FC = () => {
  const linkRetorno = 'https://serap.sme.prefeitura.sp.gov.br/';
  return (
    <div className='cadastrarItemHeader'>
      <Row className='cadastrarItemHeader-corpo'>
        <Col xs={12} md={6}>
          <Link to={linkRetorno} className='cadastrarItemHeader-retornar'>
            <ArrowLeftOutlined className='cadastrarItemHeader-icone-retornar' />
            <span className='cadastrarItemHeader-texto-retornar'>Retornar à tela inicial</span>
          </Link>
        </Col>
        <Col xs={12} md={12} className='cadastrarItemHeader-titulo'>
          Cadastrar novo item
        </Col>
        <Col xs={0} md={6} />
      </Row>
      <div className='cadastrarItemHeader-rota'>
        <div className='cadastrarItemHeader-rota-texto'>Home / Itens/ Cadastrar novo item</div>
        <div className='cadastrarItemHeader-rota-titulo'>Cadastrar novo item</div>
      </div>
    </div>
  );
};

export default ListagemItens;
