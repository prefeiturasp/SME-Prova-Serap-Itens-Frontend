import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { AppState } from '~/redux';

const Container = styled.div`
  height: 23px;
  display: flex;
  justify-content: flex-end;
  font-size: 11px;
  margin-top: 8px;
`;

const DataUltimaAtualizacao: React.FC = () => {
  const data = useSelector((state: AppState) => state.geral.dataUltimaAtualizacao);

  const [labelData, setLabelData] = useState<string>('');

  useEffect(() => {
    if (data) {
      const dataFormatada = data?.toLocaleDateString?.('pt-BR');
      const horaFormatada = data?.toLocaleTimeString?.('pt-BR');
      setLabelData(`Última atualização: ${dataFormatada} - ${horaFormatada}`);
    } else {
      setLabelData('');
    }
  }, [data]);

  return <Container>{labelData}</Container>;
};

export default DataUltimaAtualizacao;
