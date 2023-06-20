import { Button, Result } from 'antd';
import { voltarAoSerap } from '~/utils/converte-dto';

const NaoAutenticado = () => {
  return (
    <Result
      status='403'
      title='Desculpe, você não está autorizado a acessar esta página'
      subTitle='Volte ao SERAp e tente novamente'
      extra={
        <Button type='primary' onClick={() => voltarAoSerap()}>
          Voltar
        </Button>
      }
    />
  );
};

export default NaoAutenticado;
