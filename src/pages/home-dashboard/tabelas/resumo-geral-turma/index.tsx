import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useState } from 'react';
import Table from '~/components/table';
import { AlunoTurmaDto } from '~/domain/dto/aluno-turma-dto';
import { ResumoGeralProvaDto } from '~/domain/dto/resumo-geral-prova-dto';
import resumoProvasService from '~/services/resumo-service';
import { Colors } from '~/styles/colors';
import moment from 'moment';

interface TabelaDetalhesResumoGeralTurmaProps {
  dadosProva: ResumoGeralProvaDto;
  turmaId: number;
}

const TabelaDetalhesResumoGeralTurma: React.FC<TabelaDetalhesResumoGeralTurmaProps> = ({
  turmaId,
  dadosProva,
}) => {
  const [dados, setDados] = useState<AlunoTurmaDto[]>([]);
  const [carregando, setCarregando] = useState(false);

  const obterDados = useCallback(async () => {
    setCarregando(true);
    const resposta = await resumoProvasService.obterDadosResumoGeralTurma(
      turmaId,
      dadosProva.provaId,
    );

    if (resposta?.data?.length) {
      setDados(resposta.data);
    } else {
      setDados([]);
    }
    setCarregando(false);
  }, [dadosProva, turmaId]);

  useEffect(() => {
    if (dadosProva?.provaId) {
      obterDados();
    } else {
      setDados([]);
    }
  }, [dadosProva, obterDados]);

  const columns: ColumnsType<AlunoTurmaDto> = [
    {
      title: 'Nome do Estudante',
      dataIndex: 'nomeEstudante',
    },
    {
      title: 'Fez Download',
      dataIndex: 'fezDownload',
      align: 'center',
      render(fezDownload) {
        return fezDownload ? (
          <FontAwesomeIcon icon={faCircleCheck} fontSize='14' color={Colors.SIGPAE} />
        ) : (
          <FontAwesomeIcon icon={faCircleXmark} fontSize='14' color={Colors.SupportWarning} />
        );
      },
    },
    {
      title: 'Início da Prova',
      dataIndex: 'inicioProva',
      align: 'center',
      render(inicioProva) {
        return inicioProva ? moment(inicioProva).format('DD/MM/YYYY - hh:mm') : '-';
      },
    },
    {
      title: 'Fim da Prova',
      dataIndex: 'fimProva',
      align: 'center',
      render(fimProva) {
        return fimProva ? moment(fimProva).format('DD/MM/YYYY - hh:mm') : '-';
      },
    },
    {
      title: 'Tempo médio',
      dataIndex: 'tempoMedio',
      align: 'center',
      render(tempoMedio) {
        return tempoMedio ?? '-';
      },
    },
    {
      title: 'Questões Respondidas',
      dataIndex: 'questoesRespondidas',
      align: 'center',
    },
  ];

  return (
    <Table
      rowKey='nomeEstudante'
      loading={carregando}
      columns={columns}
      dataSource={dados}
      pagination={false}
    />
  );
};

export default TabelaDetalhesResumoGeralTurma;
