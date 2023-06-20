
import React from 'react';
import { Actions, BotaoSalvarAtribuirRevisor, BotaoVoltar, Container, Title } from './style';

const HeaderCadastrarItem: React.FC = () => {
 
  return (
      <Container>
        <Title>Cadastrar Novo Item</Title>
        <Actions>
        <BotaoVoltar>Voltar</BotaoVoltar>
          <BotaoSalvarAtribuirRevisor
            onClick={() => {
            //  atualizarDados();
            }}
          >
            Salvar e Atribuir Revisor
          </BotaoSalvarAtribuirRevisor>
        </Actions>
      </Container> 
  );
};

export default HeaderCadastrarItem;
