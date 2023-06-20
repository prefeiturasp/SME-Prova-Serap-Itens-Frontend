import { Tag } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SelectValueType } from '~/domain/type/select';
import { AppState } from '~/redux';
import { Colors } from '~/styles/colors';

const ContainerTag = styled(Tag)`
  font-size: 10.5px;
  color: ${Colors.Label};
  background: ${Colors.CinzaFundo};
  border: 1px solid ${Colors.CinzaBorda};
  height: 26px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  padding: 0px 5px;
`;

export interface TagItem {
  nomeCampo: string;
  descricao: React.ReactNode;
}

const TagFiltroPrincipal: React.FC = () => {
  const filtroPrincipal = useSelector((state: AppState) => state.filtroPrincipal);

  const [dadosTags, setDadosTags] = useState<TagItem[]>([]);

  const montarDados = useCallback(() => {
    const dadosTagsNovo: TagItem[] = [];
    const {
      anoLetivo,
      anosLetivos,
      situacaoProva,
      situacoesProvas,
      prova,
      provas,
      modalidade,
      modalidades,
      dre,
      dres,
      ue,
      ues,
      anoEscolar,
      anosEscolares,
      turma,
      turmas,
    } = filtroPrincipal;

    if (anoLetivo) {
      dadosTagsNovo.push({
        nomeCampo: 'anoLetivo',
        descricao: anosLetivos.find((item) => item.value === anoLetivo)?.label,
      });
    }
    if (situacaoProva) {
      dadosTagsNovo.push({
        nomeCampo: 'situacaoProva',
        descricao: situacoesProvas.find((item) => item.value === situacaoProva)?.label,
      });
    }

    if (prova?.length) {
      const provasSelecionadas = provas.filter((item) =>
        prova.includes(item?.value as SelectValueType),
      );

      if (provasSelecionadas?.length) {
        provasSelecionadas.forEach((item) => {
          dadosTagsNovo.push({
            nomeCampo: 'prova',
            descricao: item.label,
          });
        });
      }
    }
    if (modalidade) {
      dadosTagsNovo.push({
        nomeCampo: 'modalidade',
        descricao: modalidades.find((item) => item.value === modalidade)?.label,
      });
    }
    if (dre) {
      dadosTagsNovo.push({
        nomeCampo: 'dre',
        descricao: dres.find((item) => item.value === dre)?.label,
      });
    }
    if (ue) {
      dadosTagsNovo.push({
        nomeCampo: 'ue',
        descricao: ues.find((item) => item.value === ue)?.label,
      });
    }
    if (anoEscolar) {
      dadosTagsNovo.push({
        nomeCampo: 'turma',
        descricao: anosEscolares.find((item) => item.value === anoEscolar)?.label,
      });
    }
    if (turma) {
      dadosTagsNovo.push({
        nomeCampo: 'turma',
        descricao: turmas.find((item) => item.value === turma)?.label,
      });
    }
    setDadosTags(dadosTagsNovo);
  }, [filtroPrincipal]);

  useEffect(() => {
    montarDados();
  }, [filtroPrincipal, montarDados]);

  return dadosTags?.length ? (
    <>
      {dadosTags.map((item, index) => {
        return <ContainerTag key={index}>{item.descricao}</ContainerTag>;
      })}
    </>
  ) : (
    <></>
  );
};

export default TagFiltroPrincipal;
