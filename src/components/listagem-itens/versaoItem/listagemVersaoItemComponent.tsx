import { Card, Col, Row, Table, type TableColumnsType } from 'antd';
import React from 'react';
import './listagemVersaoItemComponent.css';
import TabelaVersaoItemComponent from '../tabelaVersaoItem/tabelaVersaoItemComponent';
import type { VersaoDto } from '~/domain/dto/versao-dto';

interface Props {
  versoes: VersaoDto[];
}

const ListagemVersaoItemComponent: React.FC<Props> = ({versoes}) => {
  const cardHeader = (
    <span className='versoes-titulo'>Versões do item</span>
  );

  const possuiMultiplasVersoes = (lista: VersaoDto[]) => {
    return lista && lista.length > 1;
  }

  return <div className='versoes-wrapper'>
      <Card title={cardHeader} className='versoes-container' >
        <Row>
          <Col xs={24} md={24}>
            {possuiMultiplasVersoes(versoes) ?
              <span className='versoes-descricao'>Este item possui mais versões anteriores, confira na lista abaixo.</span>
              :
              <span className='versoes-subtitulo'>Este item não possui outras versões.</span>
            }
          </Col>
        </Row>
        {possuiMultiplasVersoes(versoes) ?
          (
            <Row className='versoes-tabela-container'>
              <Col xs={24} md={24}>
                <TabelaVersaoItemComponent versoes={versoes} />
              </Col>
            </Row>
          ) : <></>
        }
      </Card>
  </div>;
};

export default ListagemVersaoItemComponent;
