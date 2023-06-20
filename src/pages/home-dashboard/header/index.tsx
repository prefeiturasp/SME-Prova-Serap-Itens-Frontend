import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from '~/components/select';
import {
  setCarregarDadosResumoProva,
  setCarregarDadosTotalizadores,
} from '~/redux/modules/geral/actions';
import geralService from '~/services/geral-service';
import DataUltimaAtualizacao from './data-ultima-atualizacao';
import { Actions, BotaoAtualizarDados, Container, Title } from './style';

const HeaderHomeDashboard: React.FC = () => {
  const dispatch = useDispatch();

  const [tiposVisualizacoesDados, setTiposVisualizacoesDados] = useState<DefaultOptionType[]>([]);

  const obterTiposVisualizacoesDados = async () => {
    const resposta = await geralService.obterTiposVisualizacoesDados();
    if (resposta?.data) {
      setTiposVisualizacoesDados(resposta.data);
    } else {
      setTiposVisualizacoesDados([]);
    }
  };

  useEffect(() => {
    obterTiposVisualizacoesDados();
  }, []);

  const atualizarDados = () => {
    dispatch(setCarregarDadosResumoProva(true));
    dispatch(setCarregarDadosTotalizadores(true));
  };

  return (
    <>
      <DataUltimaAtualizacao />
      <Container>
        <Title>Visão Geral das Provas</Title>
        <Actions>
          <Select
            value={1}
            disabled
            style={{ width: '150px', color: '#42474A' }}
            options={tiposVisualizacoesDados}
          />
          <BotaoAtualizarDados
            onClick={() => {
              atualizarDados();
            }}
          >
            Atualizar dados
          </BotaoAtualizarDados>
        </Actions>
      </Container>
    </>
  );
};

export default HeaderHomeDashboard;
