jest.mock('~/assets/filtrar.svg', () => 'mocked-icon');

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListagemTabela from './listagemTabelaComponent';
import { Situacao } from '~/domain/enums/situacao';

describe('ListagemTabela', () => {
  const dadosMock = [
    {
      id: '1',
      codigoItem: '123',
      disciplina: 'Matemática',
      enunciado: '<p>Qual é o resultado de 2 + 2?</p>',
      dificuldade: 'Fácil',
      situacao: Situacao.Ativo,
      dataCriacao: '2025-10-23T00:00:00Z',
    },
  ];

  const setPaginaMock = jest.fn();
  const onItemClickMock = jest.fn();
  const selecionaPaginasOnChangeMock = jest.fn();

  it('deve renderizar corretamente os dados na tabela', () => {
    render(
      <ListagemTabela
        dados={dadosMock}
        pagina={1}
        totalRegistros={1}
        setPagina={setPaginaMock}
        itensPorPagina={10}
        onItemClick={onItemClickMock}
        selecionaPaginasOnChange={selecionaPaginasOnChangeMock}
      />,
    );

    expect(screen.getByText('Lista de itens')).toBeInTheDocument();
    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
  });

  it('deve chamar onItemClick ao clicar em um item', async () => {
    const user = userEvent.setup();

    render(
      <ListagemTabela
        dados={dadosMock}
        pagina={1}
        totalRegistros={1}
        setPagina={setPaginaMock}
        itensPorPagina={10}
        onItemClick={onItemClickMock}
        selecionaPaginasOnChange={selecionaPaginasOnChangeMock}
      />,
    );

    await user.click(screen.getByText('Matemática'));
    expect(onItemClickMock).toHaveBeenCalledWith('1');
  });
});
