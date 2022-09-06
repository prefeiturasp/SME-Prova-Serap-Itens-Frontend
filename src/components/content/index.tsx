import { Layout } from 'antd';
import React, { ReactNode } from 'react';

import styled from 'styled-components';
import { Colors } from '~/styles/colors';

const LayoutContent = styled(Layout.Content)`
  margin-top: 110px;
  background: ${Colors.CinzaFundo};
  height: 100%;
  padding-left: 10%;
  padding-right: 10%;
  justify-content: center;
  display: grid;
`;

const CardContent = styled.div`
  width: 960px;
  min-height: 80vh;
  background: #ffffff;
  box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.16);
  border-radius: 3px;
`;

interface ContentProps {
  children: ReactNode;
  header?: ReactNode;
}

const Content: React.FC<ContentProps> = ({ children, header }) => (
  <LayoutContent>
    {header ? header : <></>}
    <CardContent>{children}</CardContent>
  </LayoutContent>
);

export default Content;
