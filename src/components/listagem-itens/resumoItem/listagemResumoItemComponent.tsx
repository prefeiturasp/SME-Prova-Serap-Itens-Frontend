import React from 'react';
import './listagemResumoItemComponent.css';
import { Button, Radio, Tag } from 'antd';
import iconEdit from '~/assets/icon-editar.svg';
import iconDelete from '~/assets/icon-remover.svg';

interface listagemResumoItemProps {
  dados?: any;
}

const dadosMockados = {
  id: 289,
  codigoItem: 13105,
  textoBase:
    "Certa manhã, João acordou cedo e decidiu preparar o café para sua mãe. Procurou o pão, o leite e o café, mas percebeu que o açúcar havia acabado. Mesmo assim, ele preparou o café e serviu com um sorriso, dizendo: 'Hoje o café está sem açúcar, mas cheio de carinho!'",
  enunciado: 'O que o texto mostra sobre a atitude de João?',
  fonte: 'Texto adaptado para fins pedagógicos.',
  versaoItem: 1,
  quantidadeVersoes: 1,
  versoesDisponiveis: [
    {
      id: 289,
      codigoItem: 13105,
      versaoItem: 1,
      dataCriacao: '23/10/2025',
    },
  ],
  alternativas: [
    {
      id: 177,
      itemId: 289,
      descricao:
        'Que ele quis fazer uma surpresa carinhosa para a mãe, mesmo com um pequeno problema.',
      ordem: 1,
      numeracao: 'A',
    },
    {
      id: 178,
      itemId: 289,
      descricao: 'Que ele ficou bravo porque o açúcar havia acabado.',
      ordem: 2,
      numeracao: 'B',
    },
    {
      id: 179,
      itemId: 289,
      descricao: 'Que ele desistiu de preparar o café quando percebeu a falta de açúcar.',
      ordem: 3,
      numeracao: 'C',
    },
    {
      id: 180,
      itemId: 289,
      descricao: 'Que ele pediu para a mãe preparar o café porque não sabia fazer.',
      ordem: 4,
      numeracao: 'D',
    },
  ],
};

const ListagemResumoItemComponent: React.FC<listagemResumoItemProps> = ({ dados }) => {
  const item = dados || dadosMockados;

  return (
    <div>
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
          <p>{item.enunciado}</p>
          <p>{item.textoBase}</p>
          <p className='resumo-item-conteudo-corpo-fonte'>
            <i>{item.fonte}</i>
          </p>

          <Radio.Group>
            {item.alternativas.map((alt: any) => (
              <div key={alt.id} className='resumo-item-conteudo-corpo-alternativa'>
                <Radio value={alt.numeracao}>
                  <b>{alt.numeracao})</b> {alt.descricao}
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
