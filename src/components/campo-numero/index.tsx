import React from 'react';
import { Input } from 'antd';

interface CampoNumeroProps {
    value: string;
    onChange: (value: string) => void;
}

export const CampoNumero: React.FC<CampoNumeroProps> = ({ value, onChange }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const valorInteiro = inputValue.split('.')[0] || '';
        const casasDecimais = (inputValue.split('.')[1] || '').slice(0, 10);
        const reg = /^-?\d*(\.\d*)?$/;
        if (
            (reg.test(inputValue) || inputValue === '' || inputValue === '-')
            && inputValue.indexOf('-.') == -1
        ) {
            const valorDecimal = `.${casasDecimais}`;
            if (casasDecimais !== '' && casasDecimais.length > 0) {
                onChange(`${valorInteiro}${valorDecimal}`);
            }
            else {
                onChange(inputValue.charAt(0) == '.' ? inputValue.replace('.', '') : inputValue);
            }
            e.target.value = value;
        }
    };

    return (
        <Input
            style={{ width: '100%' }}
            value={value}
            onChange={handleChange}
            placeholder='Digite'
        />
    );
};
