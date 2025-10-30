import { Card } from 'antd';
import React from 'react';
import './listagemSelectComponent.css';
import { AntDesignDto } from '~/domain/dto/ant-design-dto';

export interface ListagemSelectProps {
  dados: AntDesignDto[];
  itemSelecionado: AntDesignDto;
  selecionaItemOnChange: (value: any, option: any) => void;
}

const ListagemSelectComponent: React.FC<ListagemSelectProps> = ({
  dados,
  itemSelecionado,
  selecionaItemOnChange,
}) => {
  console.log(dados, itemSelecionado);
  selecionaItemOnChange(null, null);
  return (
    <>
      {/* CAIQUE SEGUE UM EXEMPLO QUE PODE TE AJUDAR, ESTE COMPONENTE AQUI VAI CHAMAR O ONCHANGE NO COMPONENTE PAI selecionaItemOnChange QUE FOI PASSADO PARA ELE POR REFERENCIA
  <Select
                        data-testid="select-aplicacao"
                        showSearch
                        placeholder="Selecione uma aplicação..."
                        className="select-custom"
                        onChange={selecionaItemOnChange}
                        value={itemSelecionado ?? undefined}
                        notFoundContent="Nenhuma aplicação encontrada"
                        filterOption={(input, option: any) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={dados}
                        /> */}

      <Card className='listagem-busca'>***CAIQUE BUSCA VEM AQUI***</Card>
    </>
  );
};

export default ListagemSelectComponent;
