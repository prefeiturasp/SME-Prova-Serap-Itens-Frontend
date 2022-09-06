import { Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardsTotalizadores, { CardTotalizador } from '~/components/cards-totalizadores';
import { AppState } from '~/redux';
import {
  setCarregarDadosTotalizadores,
  setDataUltimaAtualizacao,
} from '~/redux/modules/geral/actions';
import geralService from '~/services/geral-service';

const Totalizadores: React.FC = () => {
  const filtroPrincipal = useSelector((state: AppState) => state.filtroPrincipal);
  const carregarDadosTotalizadores = useSelector(
    (state: AppState) => state.geral,
  ).carregarDadosTotalizadores;

  const dispatch = useDispatch();

  const [dadosTotalizadores, setDadosTotalizadores] = useState<CardTotalizador[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);

  const obterDadosCardsTotalizadores = useCallback(async () => {
    setCarregando(true);
    const resposta = await geralService.obterDadosCardsTotalizadores(filtroPrincipal);

    if (resposta?.data?.length) {
      setDadosTotalizadores(resposta.data);
    } else {
      setDadosTotalizadores([]);
    }
    dispatch(setDataUltimaAtualizacao(new Date()));
    setCarregando(false);
  }, [filtroPrincipal, dispatch]);

  useEffect(() => {
    if (filtroPrincipal?.anoLetivo) {
      obterDadosCardsTotalizadores();
    } else {
      setDadosTotalizadores([]);
      dispatch(setDataUltimaAtualizacao(new Date()));
    }
  }, [filtroPrincipal, dispatch, obterDadosCardsTotalizadores]);

  useEffect(() => {
    if (carregarDadosTotalizadores) obterDadosCardsTotalizadores();
    dispatch(setCarregarDadosTotalizadores(false));
  }, [dispatch, obterDadosCardsTotalizadores, carregarDadosTotalizadores]);

  return (
    <Spin spinning={carregando}>
      <CardsTotalizadores dados={dadosTotalizadores} />
    </Spin>
  );
};

export default Totalizadores;
