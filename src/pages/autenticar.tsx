import { Button, Result, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppState } from '~/redux';
import { setIsAuthenticated } from '~/redux/modules/auth/actions';
//import autenticacaoService from '~/services/autenticacao-service';
import { voltarAoSerap } from '~/utils/converte-dto';

const ContainerAutenticar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Autenticar: React.FC<any> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paramsRouter = useParams();

  const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);

  const [autenticando, setAutenticando] = useState(true);

  const validarCodigoLogin = useCallback(async () => {
    // const codigo = paramsRouter?.codigoValidador || '';
    setAutenticando(true);

    // const resposta = await autenticacaoService
    //   .autenticarValidar(codigo)
    //   .catch(() => setAutenticando(false));

    // if (resposta?.data?.token) {
      dispatch(setIsAuthenticated(true));
      // dispatch(setToken(resposta.data.token));
      // dispatch(setDataHoraExpiracao(resposta.data.dataHoraExpiracao));
      navigate('/');
    // } else {
    //   setAutenticando(false);
    //   dispatch(setIsAuthenticated(false));
    //   dispatch(setToken(''));
    //   dispatch(setDataHoraExpiracao(''));
    // }
  }, [navigate, dispatch, paramsRouter]);

  useEffect(() => {
    if (!isAuthenticated) {
      validarCodigoLogin();
    } else {
      navigate('/');
    }
  }, [isAuthenticated, navigate, validarCodigoLogin]);

  return (
    <ContainerAutenticar>
      {autenticando ? (
        <Spin tip='Autenticando' size='large' />
      ) : (
        <Result
          status='error'
          title='Falha na autenticação'
          extra={[
            <Button type='primary' key='voltar' onClick={() => voltarAoSerap()}>
              Voltar
            </Button>,
            <Button key='tentar-novamente' onClick={() => validarCodigoLogin()}>
              Tentar novamente
            </Button>,
          ]}
        />
      )}
    </ContainerAutenticar>
  );
};

export default Autenticar;
