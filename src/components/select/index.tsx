import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Empty, Select as SelectAnt, SelectProps } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Colors } from '~/styles/colors';

const SelectContainer = styled.div`
  .ant-select {
    width: 100%;
    color: ${Colors.Label};

    .ant-select-selection-item,
    .ant-select-selection-search,
    .ant-select-item-option-content {
      font-weight: 500;
      font-size: 12px;
    }

    .ant-select-selection-placeholder {
      color: ${Colors.CinzaPaginador};
      font-weight: 500;
      font-size: 12px;
    }

    .ant-select-selector {
      border-radius: 4px;
      border: 1px solid ${Colors.CinzaBordaSelect};
    }
  }

  .rc-virtual-list-scrollbar-show {
    display: block !important;
  }
`;

const Select: React.FC<SelectProps> = (props) => {
  const filterOption = (input: any, option: any) => {
    const value = option?.value?.toLowerCase();
    const drescription = option?.label?.toLowerCase();

    return (
      value?.indexOf(input?.toLowerCase()) >= 0 ||
      drescription?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
    );
  };

  return (
    <SelectContainer>
      <SelectAnt
        getPopupContainer={(trigger) => trigger.parentNode}
        notFoundContent={
          <Empty
            description='Sem dados'
            className='ant-empty-small'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        }
        suffixIcon={
          <FontAwesomeIcon icon={faAngleDown} fontSize={14} color={Colors.CinzaIconSelect} />
        }
        {...props}
        filterOption={filterOption}
      />
    </SelectContainer>
  );
};

export default Select;
