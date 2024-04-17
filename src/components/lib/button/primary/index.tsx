import { Button, ButtonProps } from 'antd';
import React from 'react';

const ButtonPrimary: React.FC<ButtonProps> = ({ ...rest }) => (
  <Button type='primary' block style={{ display: 'flex', alignItems: 'center' }} {...rest} />
);

export default ButtonPrimary;
