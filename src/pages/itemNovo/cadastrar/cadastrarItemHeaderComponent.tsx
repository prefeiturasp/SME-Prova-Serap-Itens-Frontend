import React from 'react';
import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import './cadastrarItemHeaderComponent.css';

interface CadastrarItemHeaderComponentProps {
  pagina: number;
  editando?: boolean;
}

const CadastrarItemHeaderComponent: React.FC<CadastrarItemHeaderComponentProps> = ({
  pagina,
  editando = false,
}) => {
  const linkRetorno = '/listagem';
  const tituloPagina = editando ? 'Editar item' : 'Cadastrar novo item';
  return (
    <>
      <div className='cadastrarItemHeader'>
        <Row className='cadastrarItemHeader-corpo'>
          <Col xs={12} md={6}>
            <Link to={linkRetorno} className='cadastrarItemHeader-retornar'>
              <ArrowLeftOutlined className='cadastrarItemHeader-icone-retornar' />
              <span className='cadastrarItemHeader-texto-retornar'>Retornar à tela inicial</span>
            </Link>
          </Col>
          <Col xs={12} md={12} className='cadastrarItemHeader-titulo'>
            {tituloPagina}
          </Col>
          <Col xs={0} md={6} />
        </Row>
        <div className='cadastrarItemHeader-rota'>
          <div className='cadastrarItemHeader-rota-texto'>Home / Itens/ {tituloPagina}</div>
          <div className='cadastrarItemHeader-rota-titulo'>{tituloPagina}</div>
        </div>
        <div className='cadastrarItemHeader-Breadcrumb-corpo'>
          <div
            className={
              pagina === 1
                ? 'cadastrarItemHeader-Breadcrumb-item01'
                : 'cadastrarItemHeader-Breadcrumb-item02'
            }
          >
            <div className='cadastrarItemHeader-Breadcrumb-item01-index'>1</div>
            <div className='cadastrarItemHeader-Breadcrumb-item01-texto'>Configuração</div>
          </div>
          <RightOutlined className='cadastrarItemHeader-Breadcrumb-separator' />
          <div
            className={
              pagina === 2
                ? 'cadastrarItemHeader-Breadcrumb-item01'
                : 'cadastrarItemHeader-Breadcrumb-item02'
            }
          >
            <div className='cadastrarItemHeader-Breadcrumb-item02-index'>2</div>
            <div className='cadastrarItemHeader-Breadcrumb-item02-texto'>Elaboração do item</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CadastrarItemHeaderComponent;
