import styled from 'styled-components';
import { Colors } from '~/styles/colors';

export const CardTabelas = styled.div`
  padding: 13px 13px 0px 13px;
  margin: 16px;
  border-radius: 3px;
  border: 1px solid ${Colors.CinzaBordaCardTabela};
  background: ${Colors.CinzaCardTabela};
`;

export const TituloCardTabelas = styled.div`
  color: ${Colors.Label};
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 14px;
`;
