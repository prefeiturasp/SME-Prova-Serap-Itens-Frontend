import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spin } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useCallback, useEffect, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useDispatch, useSelector } from 'react-redux';
import { SelectValueType } from '~/domain/type/select';
import { AppState } from '~/redux';
import { setFiltroAtual } from '~/redux/modules/filtro-principal/actions';
import filtroService from '~/services/filtro-service';
import { Colors } from '~/styles/colors';
import PopoverFiltroPrincipal from './popover';
import { ContainerFiltroPrincipal } from './styles';
import TagFiltroPrincipal from './tag';

const FiltroPrincipal: React.FC = () => {
  const dispatch = useDispatch();

  const [carregado, setCarregando] = useState<boolean>(false);
  const filtroPrincipal = useSelector((state: AppState) => state.filtroPrincipal);

  const carregarDadosIniciais = useCallback(async () => {
    setCarregando(true);

    const anosLetivos = await filtroService.obterAnosLetivos();
    const anoLetivo = anosLetivos?.length ? (anosLetivos[0].value as SelectValueType) : null;

    const situacoesProvas = await filtroService.obterSituacoes();
    const situacaoProva = situacoesProvas?.length
      ? (situacoesProvas[0].value as SelectValueType)
      : null;

    let provas: DefaultOptionType[] = [];
    let prova: SelectValueType[] = [];

    if (anoLetivo && situacaoProva) {
      provas = await filtroService.obterProvas(anoLetivo, situacaoProva);
      prova = provas?.length === 1 ? ([provas[0].value] as SelectValueType[]) : [];
    }

    const modalidades = await filtroService.obterModalidades();
    const modalidade = modalidades?.length === 1 ? (modalidades[0].value as SelectValueType) : null;

    const dres = await filtroService.obterDres();
    const dre = dres?.length === 1 ? (dres[0].value as SelectValueType) : null;

    let ues: DefaultOptionType[] = [];
    let ue = null;

    let anosEscolares: DefaultOptionType[] = [];
    let anoEscolar = null;

    let turmas: DefaultOptionType[] = [];
    let turma = null;

    if (dre) {
      ues = await filtroService.obterUes(dre);
      ue = ues?.length === 1 ? (ues[0].value as SelectValueType) : null;

      if (anoLetivo && ue) {
        anosEscolares = await filtroService.obterAnosEscolares(anoLetivo, modalidade, ue);
        anoEscolar =
          anosEscolares?.length === 1 ? (anosEscolares[0].value as SelectValueType) : null;
      }
      if (anoLetivo && ue && modalidade && anoEscolar) {
        turmas = await filtroService.obterTurmas(anoLetivo, ue, modalidade, anoEscolar);
        turma = turmas?.length === 1 ? (turmas[0].value as SelectValueType) : null;
      }
    }

    dispatch(
      setFiltroAtual({
        anoLetivo,
        situacaoProva,
        prova,
        modalidade,
        dre,
        ue,
        anoEscolar,
        turma,
        anosLetivos,
        situacoesProvas,
        provas,
        modalidades,
        dres,
        ues,
        anosEscolares,
        turmas,
      }),
    );
    setCarregando(false);
  }, [dispatch]);

  useEffect(() => {
    if (!filtroPrincipal?.anoLetivo) {
      carregarDadosIniciais();
    }
  }, [filtroPrincipal, carregarDadosIniciais]);

  return (
    <Spin size='small' spinning={carregado}>
      <ContainerFiltroPrincipal>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          fontSize={18}
          color={Colors.Label}
          style={{ margin: '10px' }}
        />
        <ScrollContainer style={{ width: 549, display: 'flex', cursor: 'grab' }}>
          <TagFiltroPrincipal />
        </ScrollContainer>
        <PopoverFiltroPrincipal />
      </ContainerFiltroPrincipal>
    </Spin>
  );
};

export default FiltroPrincipal;
