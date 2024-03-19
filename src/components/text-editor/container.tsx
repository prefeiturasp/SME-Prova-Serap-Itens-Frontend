import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { EditorProps } from './component';

interface ContainerProps extends EditorProps {
  maxHeight?: string;
  children: ReactNode;
  id?: string;
}

const Container: React.FC<ContainerProps> = ({ height, children, maxHeight, id }) => {
  const Retorno = styled.div`
    .jodit-container {
      display: grid;
    }

    .campo-invalido {
      .jodit-container {
        border-color: #dc3545 !important;
      }
    }
    .jodit-status-bar :nth-child(2) {
      display: none;
    }

    .jodit-workplace,
    .jodit-wysiwyg {
      min-height: ${height || '100px'} !important;
      max-height: ${maxHeight || '420px'};
      overflow-wrap: anywhere !important;
    }

    ul,
    ol {
      padding-inline-start: 40px;
    }

    .desabilitar {
      cursor: not-allowed !important;
    }

    .jodit-ui-messages {
      display: none;
    }
  `;

  return <Retorno id={id || 'textEditor'}>{children}</Retorno>;
}

export default Container;
