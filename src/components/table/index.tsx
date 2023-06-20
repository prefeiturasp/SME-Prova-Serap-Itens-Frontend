import { Empty, Table as TableAnt, TableProps } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Colors } from '~/styles/colors';

const TableLayout = styled(TableAnt)`
  .ant-table {
    color: ${Colors.Label};
  }
  .ant-table-thead > tr > th {
    background-color: ${Colors.AzulCabecalhoTabela};
    color: ${Colors.Label};
    font-weight: 500;
    font-size: 10.5px;
    border-bottom: 1px solid ${Colors.BorderTable};
  }
  .ant-table-tbody {
    > tr > td {
      font-weight: 400;
      font-size: 9px;
      border-bottom: 0.5px solid ${Colors.BorderTable} !important;
    }
    .ant-table-expanded-row {
      > td {
        background-color: white;
      }

      .ant-table-thead > tr > th {
        background-color: ${Colors.AzulCabecalhoTabelaExpandida};
      }
    }
  }
  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    background-color: white;
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: 3px;
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 3px;
  }
  .ant-table.ant-table-small .ant-table-tbody .ant-table-wrapper:only-child .ant-table {
    margin: -0px -0px;
  }
  .ant-table-row-expand-icon {
    color: ${Colors.AzulSerap};
    border-color: ${Colors.AzulSerap};
    transform: scale(0.59);
  }

  .ant-pagination-item {
    border-color: ${Colors.BorderTable};
    border-radius: 3px;
    font-size: 16px;
    font-weight: 500;

    :hover {
      border-color: ${Colors.AzulSerap} !important;
    }
    a {
      color: ${Colors.CinzaPaginador};
      :hover {
        color: ${Colors.AzulSerap} !important;
      }
    }

    &.ant-pagination-item-active {
      border-color: ${Colors.AzulSerap} !important;

      a {
        color: ${Colors.AzulSerap} !important;
      }
    }
  }
`;

const Table: React.FC<TableProps<any>> = (props) => (
  <TableLayout
    {...props}
    pagination={
      props.pagination && { ...props.pagination, size: 'default', position: ['bottomCenter'] }
    }
    size='small'
    locale={{
      emptyText: (
        <Empty
          description='Sem dados'
          className='ant-empty-small'
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ),
    }}
  />
);

export default Table;
