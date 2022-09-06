import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '~/styles/colors';
import { voltarAoSerap } from '~/utils/converte-dto';
// import FiltroPrincipal from '../filtro-principal';

const ContainerHeader = styled(Layout.Header)`
  padding: 0;
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 110px;
  background: ${Colors.AzulSerap};
`;

// const ContainerFiltro = styled.div`
//   height: 62px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

const HeaderTitle = styled.div`
  height: 48px;
  width: 100%;
  background: #fcfcfc;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
  align-items: center;
  justify-content: center;
  display: flex;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${Colors.AzulSerap};
  justify-content: center;
`;

const BackPreviousPage = styled.div`
  position: absolute;
  left: 0;
  padding-left: 10px;

  button {
    font-weight: 400;
    font-size: 13px;
  }

  svg {
    padding-right: 9px;
  }
`;

const Header: React.FC = () => {
  return (
    <ContainerHeader>
      <HeaderTitle>
        <BackPreviousPage>
          <Button
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
            type='link'
            onClick={() => voltarAoSerap()}
          >
            Retornar a tela inicial
          </Button>
        </BackPreviousPage>
        <Title>Cadastro de Itens</Title>
      </HeaderTitle>
      {/* <ContainerFiltro>
        <FiltroPrincipal />
      </ContainerFiltro> */}
    </ContainerHeader>
  );
};

export default Header;
