import { Button, Table, type TableColumnsType } from "antd";
import type { VersaoDto } from "~/domain/dto/versao-dto";
import './tabelaVersaoItemComponent.css';
import iconEdit from '~/assets/icon-editar.svg';
import iconDelete from '~/assets/icon-remover.svg';

interface Props {
  versoes: VersaoDto[];
}

const TabelaVersaoItemComponent: React.FC<Props> = ({versoes}) => {

  const editarHandler = (id: number) => {
    // Lógica para editar a versão do item
  }

  const removerHandler = (id: number) => {
    // Lógica para remover a versão do item
  }

  const acaoColumnRender = (id: number) => {
    return <div className="acao-container">
      <Button type="primary" className="btn-acao btn-editar" onClick={() => editarHandler(id)}>
        <img src={iconEdit} alt="Editar" style={{width: 12, height: 12}}/>
      </Button>
      <Button type="default" className="btn-acao btn-remover" onClick={() => removerHandler(id)}>
        <img src={iconDelete} alt="Remover" style={{ width: 16, height: 16 }} />
      </Button>
    </div>;
  }

  const ordernarListaVersoes = (lista: VersaoDto[]) => {
    if(lista && lista.length > 0){
      return lista.sort((a, b) => b.versaoItem - a.versaoItem);
    }
    return [];
  }

  const versaoColumns: TableColumnsType<VersaoDto> = [
    { title: 'Código do item', dataIndex: 'codigoItem', ellipsis: true },
    { title: 'Versão', dataIndex: 'versaoItem' , width: 100 },
    { title: 'Data de criação', dataIndex: 'dataCriacao', width: 200 },
    { title: 'Ação', render: () => acaoColumnRender(0), width: 100 },
  ];
  
  return <Table<VersaoDto> columns={versaoColumns} dataSource={ordernarListaVersoes(versoes)} pagination={false} bordered={false} className="tabela-versao-item">

  </Table>;
};

export default TabelaVersaoItemComponent;