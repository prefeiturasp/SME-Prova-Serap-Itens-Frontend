import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonProps } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/redux';
import { setAbrirFiltroPrincipal } from '~/redux/modules/geral/actions';
import { Colors } from '~/styles/colors';

const IconeAbrirPopover: React.FC<ButtonProps> = ({ loading }) => {
  const dispatch = useDispatch();

  const abrirFiltroPrincipal = useSelector((state: AppState) => state.geral.abrirFiltroPrincipal);

  const abrirFiltroPrincipalHandler = () =>
    dispatch(setAbrirFiltroPrincipal(!abrirFiltroPrincipal));

  return (
    <Button
      loading={loading}
      size='small'
      shape='circle'
      style={{ background: Colors.BorderTable, width: '28px', height: '28px', margin: '3px' }}
      onClick={() => abrirFiltroPrincipalHandler()}
      icon={
        <FontAwesomeIcon
          icon={abrirFiltroPrincipal ? faCaretUp : faCaretDown}
          fontSize={7}
          color={Colors.Label}
        />
      }
    />
  );
};

export default IconeAbrirPopover;
