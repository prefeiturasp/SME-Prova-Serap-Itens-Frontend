import { Layout } from 'antd';
import React, { ReactNode } from 'react';
import Header from '~/components/header';

const MainContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Layout>
      <Header />
      {children}
    </Layout>
  );
};

export default MainContent;
