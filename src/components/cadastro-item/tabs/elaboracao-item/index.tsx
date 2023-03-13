import React from 'react';
import { FormProps } from 'antd';

const ElaboracaoItem: React.FC<FormProps> = ({ form }) => {
    return (<h1>Elaboração do item</h1>);
};

export default React.memo(ElaboracaoItem);
