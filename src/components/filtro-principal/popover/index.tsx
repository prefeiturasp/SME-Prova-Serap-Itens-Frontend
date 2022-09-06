import { Popover } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '~/redux';
import { setAbrirFiltroPrincipal } from '~/redux/modules/geral/actions';
import IconeAbrirPopover from '../icone-abrir-popover';
import CamposFiltroPrincipal from './campos';

const PopoverFiltroPrincipal: React.FC = () => {
  const dispatch = useDispatch();

  const abrirFiltroPrincipal = useSelector((state: AppState) => state.geral.abrirFiltroPrincipal);

  useEffect(() => {
    return () => {
      dispatch(setAbrirFiltroPrincipal(false));
    };
  }, [dispatch]);

  return (
    <Popover
      getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
      overlayInnerStyle={{ width: '620px', height: '260px' }}
      align={{ targetOffset: [292, 13] }}
      showArrow={false}
      content={<CamposFiltroPrincipal />}
      trigger='click'
      visible={abrirFiltroPrincipal}
      onVisibleChange={(v) => dispatch(setAbrirFiltroPrincipal(v))}
      placement='bottom'
    >
      <IconeAbrirPopover />
    </Popover>
  );
};

export default PopoverFiltroPrincipal;
