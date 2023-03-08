import React, { useState } from 'react';
import { TagsInput } from 'react-tag-input-component';
import './styles.css';

const InputTag: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div>
      <TagsInput
        classNames={{
          input: 'ant-input css-dev-only-do-not-override-diro6f',
          tag: '',
        }}
        value={selected}
        onChange={setSelected}
        name='Palavra-chave'
        placeHolder='palavras-chave'
      />
    </div>
  );
};

export default React.memo(InputTag);
