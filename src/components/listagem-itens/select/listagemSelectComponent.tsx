import { Card, Col, Row, Select } from 'antd';
import React, { useState } from 'react';
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

  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    buscarItemOnSearch(value);
  };

  return (
    <>
      <Card className='listagem-busca'>
        <Row>
          <span className='titulo-listagem-busca'>Você pode buscar um item específico</span>
          <Col span={24}>
            <Select
              allowClear
              labelInValue
              showSearch
              filterOption={false}
              data-testid='select-aplicacao'
              onSearch={handleSearchChange}
              placeholder='Digite o código do item'
              className='select-custom'
              onChange={selecionaItemOnChange}
              value={itemSelecionado ?? undefined}
              notFoundContent={searchValue?.length >= 3 ? 'Não encontramos nenhum item com o trecho digitado...' : 'Digite ao menos 3 caracteres para buscar'}
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
 