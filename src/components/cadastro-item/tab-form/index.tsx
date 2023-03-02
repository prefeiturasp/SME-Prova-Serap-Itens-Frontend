import React from 'react';
import { Tab } from 'rc-tabs/lib/interface';
import { Tabs, FormProps } from 'antd';
import ComponentesItem from '~/components/cadastro-item/tabs/componentes-item';
import ConfiguracaoItem from '~/components/cadastro-item/tabs/configuracao-item';
import ElaboracaoItem from '~/components/cadastro-item/tabs/elaboracao-item';

const TabForm: React.FC<FormProps> = ({ form }) => {
    const tabs: Array<Tab> = [
        { key: '1', label: 'Configuração', children: <ConfiguracaoItem form={form} /> },
        {
            key: '2',
            label: 'Componentes do item',
            children: <ComponentesItem form={form} />,
        },
        { key: '3', label: 'Elaboração do item', children: <ElaboracaoItem form={form} /> },
    ];

    return <Tabs className='margemTabs' defaultActiveKey='1' type='card' items={tabs} />;
};

export default React.memo(TabForm);
