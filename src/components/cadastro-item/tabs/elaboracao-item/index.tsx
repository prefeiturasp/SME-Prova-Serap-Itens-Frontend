import React from 'react';
import { FormProps } from 'antd';
import TextEditor from '~/components/text-editor';

const ElaboracaoItem: React.FC<FormProps> = () => {
    return (<TextEditor></TextEditor>);
};

export default React.memo(ElaboracaoItem);
