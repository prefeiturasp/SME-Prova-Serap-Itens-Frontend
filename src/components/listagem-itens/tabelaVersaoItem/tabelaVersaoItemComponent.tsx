import { Button, Switch, Table, type TableColumnsType } from 'antd';
import type { VersaoDto } from '~/domain/dto/versao-dto';
import './tabelaVersaoItemComponent.css';
import iconEdit from '~/assets/icon-editar.svg';
import iconDelete from '~/assets/icon-remover.svg';
import { SituacaoItem } from '~/domain/enums/situacao-item';

interface Props {
  versoes: VersaoDto[];
  onEditarVersao?: (itemId: number) => void;
  onToggleAtivo?: (id: number, novoStatus: number) => void;
}

const TabelaVersaoItemComponent: React.FC<Props> = ({ versoes, onEditarVersao, onToggleAtivo }) => {
  const editarHandler = (id: number) => {
    if (!onEditarVersao) return;
    onEditarVersao(id);
  };

  const removerHandler = (id: number) => {
    // Lógica para remover a versão do item
    console.log(id);
  };

  const situacaoColumnRender = (_: any, record: VersaoDto) => {
    const isAtivo = record.situacaoItem === SituacaoItem.Ativo;
    return (
      <Switch
        checked={isAtivo}
        onChange={(checked) => {
          const novoStatus = checked ? SituacaoItem.Ativo : SituacaoItem.Inativo;
          onToggleAtivo && onToggleAtivo(record.id, novoStatus);
        }}
      />
    );
  };

  const acaoColumnRender = (_: any, record: VersaoDto) => {
    return (
      <div className='acao-container'>
        <Button
          type='primary'
          className='btn-acao btn-editar'
          onClick={() => editarHandler(record.id)}
        >
          <img src={iconEdit} alt='Editar' style={{ width: 12, height: 12 }} />
        </Button>
        <Button
          type='default'
          className='btn-acao btn-remover'
          onClick={() => removerHandler(record.id)}
        >
          <img src={iconDelete} alt='Remover' style={{ width: 16, height: 16 }} />
        </Button>
      </div>
    );
  };

  const ordernarListaVersoes = (lista: VersaoDto[]) => {
    if (lista && lista.length > 0) {
      return lista.sort((a, b) => b.versaoItem - a.versaoItem);
    }
    return [];
  };

  const versaoColumns: TableColumnsType<VersaoDto> = [
    { title: 'Código do item', dataIndex: 'codigoItem', ellipsis: true },
    { title: 'Versão', dataIndex: 'versaoItem', width: 100 },
    { title: 'Data de criação', dataIndex: 'dataCriacao', width: 150 },
    { title: ' ', render: situacaoColumnRender, width: 50 },
    { title: 'Ação', render: acaoColumnRender, width: 100 },
  ];

  return (
    <Table<VersaoDto>
      columns={versaoColumns}
      dataSource={ordernarListaVersoes(versoes)}
      pagination={false}
      bordered={false}
      className='tabela-versao-item'
    ></Table>
  );
};

export default TabelaVersaoItemComponent;
