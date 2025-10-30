import { Card, Pagination, Tag } from 'antd';
import React from 'react';
import './listagemTabelaComponent.css';
import type { ItemListagemDto } from '~/domain/dto/item-listagem-dto';
import { Situacao, SituacaoDescricao } from '~/domain/enums/situacao';
import iconFilter from '~/assets/filtrar.svg';

interface ListagemTabelaProps {
  dados: ItemListagemDto[];
  pagina: number;
  totalRegistros: number;
  setPagina: (p: number) => void;
  ITENS_POR_PAGINA: number;
  onItemClick?: (id: string) => void;
}

const ListagemTabela: React.FC<ListagemTabelaProps> = ({
  dados,
  pagina,
  totalRegistros,
  setPagina,
  ITENS_POR_PAGINA,
  onItemClick,
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

  const inicio = (pagina - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;

  return (
    <>
      <Card className='listagem-tabela'>
        <div className='listagem-tabela-head'>
          <div className='listagem-tabela-texto'>
            <div className='listagem-tabela-titulo'>Lista de itens</div>
            <div className='listagem-tabela-subtitulo'>
              Selecione um item para conferir mais detalhes ao lado.
            </div>
          </div>
          <div className='listagem-tabela-filtrar'>
            <img src={iconFilter} alt='Editar' width={24} height={24} />
            FILTRAR
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}
                >
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
                </div>

                <div>
                  <b>Enunciado do item:</b>
                  <br></br>

                  {item.enunciado && item.enunciado.trim() !== '' ? (
                    <div dangerouslySetInnerHTML={{ __html: item.enunciado }} />
                  ) : (
                    <i>[Enunciado não cadastrado]</i>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ marginTop: 4 }}>
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
                        ...corSituacao(item.situacao === null ? Situacao.Rascunho : item.situacao),
                      }}
                    >
                      <b>Situação: </b>{' '}
                      {
                        SituacaoDescricao[
                          item.situacao === null ? Situacao.Rascunho : item.situacao
                        ]
                      }
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

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <div className='listagem-item-tabela-auto'>
            {`${inicio + 1}-${Math.min(fim, totalRegistros)} de ${totalRegistros} itens`}
          </div>

          <div>
            <Pagination
              current={pagina}
              total={totalRegistros}
              pageSize={ITENS_POR_PAGINA}
              onChange={(p) => setPagina(p)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default ListagemTabela;
