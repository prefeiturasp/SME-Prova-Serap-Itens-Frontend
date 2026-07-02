jest.mock('~/assets/icon-editar.svg', () => 'mockedIconEdit');
jest.mock('~/assets/icon-remover.svg', () => 'mockedIconDelete');
jest.mock('./listagemResumoItemComponent.css', () => ({}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListagemResumoItemComponent from './listagemResumoItemComponent';

describe('ListagemResumoItemComponent', () => {
  const dadosMock = {
    id: 10,
    codigoItem: 123,
    enunciado: '<p>Qual é a capital do Brasil?</p>',
    textoBase: '<p>Texto base de exemplo</p>',
    fonte: '<p>Fonte de teste</p>',
    alternativas: [
      { id: 1, numeracao: 'A', descricao: 'Brasília' },
      { id: 2, numeracao: 'B', descricao: 'São Paulo' },
    ],
  };

  it('deve renderizar o título e os botões corretamente', () => {
    render(<ListagemResumoItemComponent dados={dadosMock} />);
    expect(screen.getByText('Resumo do item')).toBeInTheDocument();
    expect(screen.getByText('Editar Item')).toBeInTheDocument();
    expect(screen.getByText('Excluir Item')).toBeInTheDocument();
  });

  it('deve exibir o código do item', () => {
    render(<ListagemResumoItemComponent dados={dadosMock} />);
    expect(screen.getByText(/Código do item:/)).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('deve exibir enunciado, texto base e fonte', () => {
    render(<ListagemResumoItemComponent dados={dadosMock} />);
    expect(screen.getByText('Qual é a capital do Brasil?')).toBeInTheDocument();
    expect(screen.getByText('Texto base de exemplo')).toBeInTheDocument();
    expect(screen.getByText('Fonte de teste')).toBeInTheDocument();
  });

  it('deve exibir alternativas corretamente', () => {
    render(<ListagemResumoItemComponent dados={dadosMock} />);
    expect(screen.getByText('A)')).toBeInTheDocument();
    expect(screen.getByText('B)')).toBeInTheDocument();
    expect(screen.getByText('Brasília')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
  });

  it('deve mostrar mensagens padrão quando campos estão vazios', () => {
    const dadosIncompletos = { codigoItem: 999, alternativas: [] };
    render(<ListagemResumoItemComponent dados={dadosIncompletos} />);
    expect(screen.getByText('Enunciado não cadastrado')).toBeInTheDocument();
    expect(screen.getByText('Texto base não cadastrado')).toBeInTheDocument();
    expect(screen.getByText('Fonte não cadastrada')).toBeInTheDocument();
  });

  it('deve disparar callback ao clicar em editar item', async () => {
    const onEditarItem = jest.fn();

    render(<ListagemResumoItemComponent dados={dadosMock} onEditarItem={onEditarItem} />);

    await userEvent.click(screen.getByRole('button', { name: /Editar Item/i }));

    expect(onEditarItem).toHaveBeenCalledTimes(1);
    expect(onEditarItem).toHaveBeenCalledWith(10);
  });
});
