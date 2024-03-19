import React, { memo } from 'react';
import Editor, { EditorProps } from './component';
import Container from './container';
import { Jodit } from 'jodit-react';

const TextEditor = React.forwardRef<Jodit, EditorProps>((props, ref) => {
  return (
    <Container {...props}>
      <Editor ref={ref} {...props} />
    </Container>
  );
});

export default memo(TextEditor);
