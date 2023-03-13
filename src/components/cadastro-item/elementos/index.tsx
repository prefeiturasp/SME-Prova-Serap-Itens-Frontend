import styled from 'styled-components';
import { Colors } from '~/styles/colors';

export const SpanInfoEstatisticas: React.ReactNode = (
    <span className='spanlblInfoEstatisticas'>(de 0 até 10)</span>
);

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
      margin-bottom: 30px;
      padding-left: 2rem;
      padding-right: 4rem;
      background: ${Colors.CinzaFundo};
    `;

export const Separador = styled.hr`
    opacity: 0.5;
`;
