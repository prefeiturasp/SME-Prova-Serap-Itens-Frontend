import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListagemItens from './listagemItens';

beforeAll(() => {
  window.scrollTo = jest.fn();
});

describe('Componente ListagemItens', () => {
  it('deve renderizar o título e subtítulo corretos', async () => {
    render(
      <MemoryRouter>
        <ListagemItens />
      </MemoryRouter>,
    );

    // Usa getAllByText porque há mais de uma ocorrência
    const titulos = await screen.findAllByText(/Cadastrar novo item/i);
    expect(titulos.length).toBeGreaterThan(0);

    const subtitulo = await screen.findByText(
      /Sua lista de itens criados\. Você pode conferir detalhes/i,
    );
    expect(subtitulo).toBeInTheDocument();
  });

  it('deve exibir a tabela e o texto FILTRAR', async () => {
    render(
      <MemoryRouter>
        <ListagemItens />
      </MemoryRouter>,
    );

    // Há múltiplos "Lista de itens" (um no cabeçalho e outro na tabela)
    const listaItens = await screen.findAllByText(/Lista de itens/i);
    expect(listaItens.length).toBeGreaterThan(0);

    const filtrar = await screen.findByText(/FILTRAR/i);
    expect(filtrar).toBeInTheDocument();
  });

  it('deve navegar para a rota de criação ao clicar no botão', async () => {
    render(
      <MemoryRouter>
        <ListagemItens />
      </MemoryRouter>,
    );

    const botao = await screen.findByRole('button', { name: /CRIAR NOVO ITEM/i });
    fireEvent.click(botao);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('deve exibir o link de retorno corretamente', async () => {
    render(
      <MemoryRouter>
        <ListagemItens />
      </MemoryRouter>,
    );

    const link = await screen.findByRole('link', { name: /Retornar à tela inicial/i });
    expect(link).toHaveAttribute('href', '/https://serap.sme.prefeitura.sp.gov.br/');
  });
});
