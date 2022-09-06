import { Button } from 'antd';
import styled from 'styled-components';
import { Colors } from '~/styles/colors';

export const Container = styled.div`
  height: 30px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Title = styled.div`
  color: #595959;
  font-weight: 500;
  font-size: 20px;
  justify-content: flex-start;
`;

export const Actions = styled.div`
  justify-content: flex-end;
  display: flex;
`;

export const BotaoAtualizarDados = styled(Button)`
  width: 126px;
  margin-left: 13px;
  color: ${Colors.AzulSerap};
  font-weight: 700;
`;
