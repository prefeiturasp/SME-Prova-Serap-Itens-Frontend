import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logout, setUserLogged } from '~/redux/modules/auth/reducers';
import autenticacaoService from '~/services/autenticacao-service';

const Autenticar: React.FC<any> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get('codigo');
  const isExecuting = useRef(false);

  const verificarToken = async () => {
    if (isExecuting.current) return;
    isExecuting.current = true;

    const storedToken = localStorage.getItem('authToken');
    const dataHoraExpiracao = localStorage.getItem('authExpiresAt');

    if (codigo) {
      try {
        const resposta = await autenticacaoService.autenticarValidar(codigo);

        const { token, dataHoraExpiracao } = resposta.data;

        dispatch(setUserLogged({ token, dataHoraExpiracao }));

        navigate('/');
      } catch (error) {
        console.error('Erro ao autenticar:', error);
        navigate('/sem-acesso');
      }
    } else {
      if (storedToken && dataHoraExpiracao) {
        const expiraEm = new Date(dataHoraExpiracao);
        if (expiraEm > new Date()) {
          dispatch(
            setUserLogged({
              token: storedToken,
              dataHoraExpiracao: dataHoraExpiracao,
            }),
          );

          navigate('/');

          return;
        } else {
          dispatch(logout());
          navigate('/sem-acesso');
        }
      } else {
        navigate('/sem-acesso');
      }
    }
  };

  useEffect(() => {
    verificarToken();
  }, [codigo, dispatch, navigate]);

  return <div>Autenticando...</div>;
};

export default Autenticar;
