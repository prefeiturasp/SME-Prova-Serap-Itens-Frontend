import React, { Dispatch, SetStateAction, useCallback, useState, useEffect } from 'react';
import { TagsInput } from 'react-tag-input-component';
import { validarCampoArrayStringForm } from '~/utils/funcoes';
import './styles.css';

interface InputTagProps {
  setTags: Dispatch<SetStateAction<string[] | undefined>>;
  tags: string[] | undefined;
  valueForm: string[] | undefined;
}

const InputTag: React.FC<InputTagProps> = ({ setTags, tags, valueForm }) => {

  const [erro, setErro] = useState<boolean>(!(valueForm === undefined));

  const setValorTags = useCallback(
    (valorTags: string[] | undefined) => {
      setTags(valorTags !== undefined ? valorTags : []);
      setErro(validarCampoArrayStringForm(valorTags ?? []));
    },
    [setTags],
  );

  useEffect(() => {
    if (valueForm === undefined)
      setErro(false);
  }, [valueForm, tags]);

  return (
    <>
      <div className={erro === true ? 'error' : ''}>
        <TagsInput
          classNames={{
            input: 'ant-input',
            tag: 'tag-input',

          }}
          value={tags ?? []}
          onChange={setValorTags}
          name='Palavra-chave'
          placeHolder='Digite'
        />
      </div>
      <div className='requered'>
        <div
          id='tipoItem_help'
          className='ant-form-item-explain ant-form-item-explain-connected css-dev-only-do-not-override-diro6f'
          role='alert'
        >
          <div className='ant-form-item-explain-error'>
            {erro === true ? 'Campo obrigatório' : ''}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(InputTag);
