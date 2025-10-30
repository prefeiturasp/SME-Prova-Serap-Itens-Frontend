import { Card, Col, Row, Select } from 'antd';
import React from 'react';
import './listagemSelectComponent.css';
import { DefaultOptionType } from 'antd/es/select';

export interface ListagemSelectProps {
  dados: DefaultOptionType[];
  itemSelecionado: DefaultOptionType;
  selecionaItemOnChange: (value: any, option: any) => void;
  buscarItemOnSearch: (value: string) => void;
  loading: boolean;
}

const ListagemSelectComponent: React.FC<ListagemSelectProps> = ({
  dados,
  itemSelecionado,
  selecionaItemOnChange,
  buscarItemOnSearch,
  loading,
}) => {
  console.log(dados);

  return (
    <>
      <Card className='listagem-busca'>
        <Row>
          <span className='titulo-listagem-busca'>Você pode buscar um item específico</span>
          <Col span={24}>
            <Select
              labelInValue
              showSearch
              filterOption={false}
              data-testid='select-aplicacao'
              onSearch={buscarItemOnSearch}
              placeholder='Digite o código do item'
              className='select-custom'
              onChange={selecionaItemOnChange}
              value={itemSelecionado ?? undefined}
              notFoundContent='Não encontramos nenhum item com o trecho digitado...'
              loading={loading}
              options={dados}
              style={{ width: '100%' }}
            />{' '}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ListagemSelectComponent;
