import React from 'react';
import './listagemResumoItemComponent.css';
import { Button, Radio } from 'antd';
import iconEdit from '~/assets/icon-editar.svg';
import iconDelete from '~/assets/icon-remover.svg';
import { htmlSeguro } from '~/utils/html-seguro';
interface AlternativaResumoViewModel {
  id: number | string;
  numeracao: string;
  descricao: string;
}

interface ItemResumoViewModel {
  codigoItem?: string | number;
  enunciado?: string;
  textoBase?: string;
  fonte?: string;
  alternativas?: AlternativaResumoViewModel[];
}

interface listagemResumoItemProps {
  dados?: ItemResumoViewModel;
}

const ListagemResumoItemComponent: React.FC<listagemResumoItemProps> = ({ dados }) => {
  const item = dados;

  if (!item) return <></>;

  return (
    <div className='resumo'>
      <div className='resumo-item'>
        <div className='resumo-item-titulo'>Resumo do item</div>

        <div className='resumo-item-botoes'>
          <Button className='btn-azul-padrao'>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <img src={iconEdit} alt='Editar' width={16} height={16} />
              <span>Editar Item</span>
            </div>
          </Button>

          <Button className='btn-azul-branco'>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <img src={iconDelete} alt='Excluir' width={16} height={16} />
              <span>Excluir Item</span>
            </div>
          </Button>
        </div>
      </div>

      <div className='resumo-item-conteudo'>
        <div className='resumo-item-conteudo-head'>
          <div className='resumo-item-conteudo-head-title'>Visão do estudante</div>
          <div className='resumo-item-conteudo-head-tag'>
            Código do item: <b>{item.codigoItem}</b>
          </div>
        </div>

        <div className='resumo-item-conteudo-corpo'>
          <div className='resumo-item-conteudo-itens'>
            {item.enunciado && item.enunciado.trim() !== '' ? (
              <div dangerouslySetInnerHTML={htmlSeguro(item.enunciado)} />
            ) : (
              <i>Enunciado não cadastrado</i>
            )}
          </div>
          <div className='resumo-item-conteudo-itens'>
            {item.textoBase && item.textoBase.trim() !== '' ? (
              <div dangerouslySetInnerHTML={htmlSeguro(item.textoBase)} />
            ) : (
              <i>Texto base não cadastrado</i>
            )}
          </div>
          <div className='resumo-item-conteudo-corpo-fonte'>
            {item.fonte && item.fonte.trim() !== '' ? (
              <i dangerouslySetInnerHTML={htmlSeguro(item.fonte)} />
            ) : (
              <i>Fonte não cadastrada</i>
            )}
          </div>
          <br />
          <Radio.Group className='radio-group-alterantivas no-click'>
            {(item.alternativas ?? []).map((alt: AlternativaResumoViewModel) => (
              <div key={alt.id} className='resumo-item-conteudo-corpo-alternativa'>
                <Radio value={alt.numeracao}>
                  <div className='radio-alternativa-conteudo'>
                    <b>{alt.numeracao})</b>{' '}
                    <div dangerouslySetInnerHTML={htmlSeguro(alt.descricao)}></div>
                  </div>
                </Radio>
              </div>
            ))}
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

export default ListagemResumoItemComponent;
