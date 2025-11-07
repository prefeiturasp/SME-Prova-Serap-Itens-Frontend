import { Card, Pagination, Select, Tag } from 'antd';
import React, { useState } from 'react';
import './listagemTabelaComponent.css';
import type { ItemListagemDto } from '~/domain/dto/item-listagem-dto';
import { Situacao, SituacaoDescricao } from '~/domain/enums/situacao';
import iconFilter from '~/assets/filtrar.svg';
import FiltroPrincipalNovoComponent from '~/components/filtro-principal-novo/filtroPrincipalNovoComponent';


interface ListagemTabelaProps {
  dados: ItemListagemDto[];
  pagina: number;
  totalRegistros: number;
  setPagina: (p: number) => void;
  itensPorPagina: number;
  onItemClick?: (id: string) => void;
  selecionaPaginasOnChange: (value: any, option: any) => void;
}

const ListagemTabela: React.FC<ListagemTabelaProps> = ({
  dados,
  pagina,
  totalRegistros,
  setPagina,
  itensPorPagina,
  onItemClick,
  selecionaPaginasOnChange,
}) => {
  const corDificuldade = (nivel: string) => {
    switch (nivel) {
      case 'Muito fácil':
        return { color: '#595959', background: '#86E97A', border: '0' };
      case 'Fácil':
        return { color: '#FFFFFF', background: '#21C45D', border: '0' };
      case 'Médio':
        return { color: '#595959', background: '#F9C74F', border: '0' };
      case 'Difícil':
        return { color: '#FFFFFF', background: '#F3722C', border: '0' };
      case 'Muito difícil':
        return { color: '#FFFFFF', background: '#D62828', border: '0' };
      default:
        return {};
    }
  };

  const corSituacao = (status: Situacao) => {
    switch (status) {
      case Situacao.Ativo:
        return { color: '#FFFFFF', background: '#21C45D', border: '0' };
      case Situacao.Pendente:
        return { color: '#595959', background: '#F9C74F', border: '0' };
      case Situacao.Rascunho:
        return { color: '#FFFFFF', background: '#B0B0B0', border: '0' };
      case Situacao.Inativo:
        return { color: '#FFFFFF', background: '#D62828', border: '0' };
      default:
        return {};
    }
  };

  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleSetOpen = (value: boolean) => {
    setOpen(value);

    //Pegando o filtro lateral do localStorage ao fechar o drawer
    if(value === false){
      const itemFiltro = localStorage.getItem('itemFiltro');
      const itemFiltroAtualizado = JSON.parse(itemFiltro || '{}');
      if(itemFiltroAtualizado.filtroLateral){
        console.log('Filtro lateral aplicado:', itemFiltroAtualizado.filtroLateral);
      }
    }
  };
  
  return (
    <>
      <FiltroPrincipalNovoComponent open={open} setOpen={handleSetOpen} />
      <Card className='listagem-tabela'>
        <div className='listagem-tabela-head'>
          <div className='listagem-tabela-texto'>
            <div className='listagem-tabela-titulo'>Lista de itens</div>
            <div className='listagem-tabela-subtitulo'>
              Selecione um item para conferir mais detalhes ao lado.
            </div>
          </div>
          <div className='listagem-tabela-filtrar' onClick={handleOpenDrawer} style={{ cursor: 'pointer' }}>
            <img src={iconFilter} alt='Editar' width={24} height={24} />
            FILTRAR
          </div>
        </div>
        <div className='listagem-tabela-filtrar'>
          <img src={iconFilter} alt='Filtrar' width={24} height={24} />
          FILTRAR
        </div>
      </div>

      <div className='listagem-tabela-conteudo'>
        {dados.map((item, index) => (
          <div
            key={index}
            className='listagem-item-tabela'
            onClick={() => onItemClick?.(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onItemClick?.(item.id);
            }}
            role='button'
            tabIndex={0}
          >
            <div className='listagem-item-tabela-conteudo'>
              <div className='listagem-item-tabela-head'>
                <div className='listagem-item-tabela-flex'>
                  <b>Código do item: </b>
                  {item.codigoItem}
                </div>
                <div className='listagem-item-tabela-auto'>
                  <b>Componente curricular: </b>
                  {item.disciplina}
                </div>
              </div>

              <div>
                <b>Enunciado do item:</b>
                <br />
                {item.enunciado && item.enunciado.trim() !== '' ? (
                  <div dangerouslySetInnerHTML={{ __html: item.enunciado }} />
                ) : (
                  <i>[Enunciado não cadastrado]</i>
                )}
              </div>

              <div className='listagem-item-tabela-rodape'>
                <div className='listagem-item-tabela-rodape-info'>
                  {item.dificuldade && (
                    <Tag
                      style={{
                        borderRadius: '8px',
                        marginRight: 8,
                        ...corDificuldade(item.dificuldade),
                      }}
                    >
                      <b>Dificuldade: </b> {item.dificuldade}
                    </Tag>
                  )}
                  <Tag
                    style={{
                      borderRadius: '8px',
                      ...corSituacao(item.situacao ?? Situacao.Rascunho),
                    }}
                  >
                    <b>Situação: </b> {SituacaoDescricao[item.situacao ?? Situacao.Rascunho]}
                  </Tag>
                </div>
                <div>
                  <b>Data de criação: </b>
                  {new Date(item.dataCriacao).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='listagem-item-tabela-paginacao'>
        <div className='listagem-item-tabela-auto'>
          {`${inicio + 1}-${Math.min(fim, totalRegistros)} de ${totalRegistros} itens`}
        </div>
        <Pagination
          current={pagina}
          total={totalRegistros}
          pageSize={itensPorPagina}
          onChange={setPagina}
          showSizeChanger={false}
        />
        <Select
          className='listagem-item-tabela-select'
          defaultValue={10}
          options={[
            { value: 10, label: '10' },
            { value: 20, label: '20' },
            { value: 30, label: '30' },
            { value: 40, label: '40' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
          ]}
          onChange={selecionaPaginasOnChange}
        />
      </div>
    </Card>
    </>
  );
};

export default ListagemTabela;
