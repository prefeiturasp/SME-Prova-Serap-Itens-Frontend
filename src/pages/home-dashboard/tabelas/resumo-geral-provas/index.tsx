import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import Table from '~/components/table';
import { ResumoGeralProvaDto } from '~/domain/dto/resumo-geral-prova-dto';

interface TabelaDetalhesResumoGeralProvasProps {
  dadosProva: ResumoGeralProvaDto;
}

const TabelaDetalhesResumoGeralProvas: React.FC<TabelaDetalhesResumoGeralProvasProps> = ({
  dadosProva,
}) => {
  const columns: ColumnsType<any> = [
    {
      title: 'Data de início',
      dataIndex: ['detalheProva', 'dataInicio'],
      align: 'center',
      render(dataInicio) {
        return dataInicio ? moment(dataInicio).format('DD/MM/YYYY') : '';
      },
    },
    {
      title: 'Data de fim',
      dataIndex: ['detalheProva', 'dataFim'],
      align: 'center',
      render(dataFim) {
        return dataFim ? moment(dataFim).format('DD/MM/YYYY') : '';
      },
    },
    {
      title: 'Qtde. Questões da prova',
      dataIndex: ['detalheProva', 'qtdeQuestoesProva'],
      align: 'center',
    },
    {
      title: 'Total de Questões',
      dataIndex: ['detalheProva', 'totalQuestoes'],
      align: 'center',
    },
    {
      title: 'Respondidas',
      dataIndex: ['detalheProva', 'respondidas'],
      align: 'center',
    },
    {
      title: 'Percentual respondido',
      dataIndex: ['detalheProva', 'percentualRespondido'],
      align: 'center',
      render(percentualRespondido) {
        return `${percentualRespondido}%`;
      },
    },
  ];
  return <Table rowKey='provaId' columns={columns} dataSource={[dadosProva]} pagination={false} />;
};

export default TabelaDetalhesResumoGeralProvas;
