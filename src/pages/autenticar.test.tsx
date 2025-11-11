import { render, screen, waitFor } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import autenticacaoService from '~/services/autenticacao-service';
import * as authReducers from '~/redux/modules/auth/reducers';
import Autenticar from './autenticar';

let consoleErrorSpy: jest.SpyInstance;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux');
  return {
    __esModule: true,
    ...originalModule,
    useDispatch: () => mockDispatch,
  };
});

jest.mock('~/services/autenticacao-service', () => ({
  __esModule: true,
  default: {
    autenticarValidar: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
    useSearchParams: () => mockUseSearchParams(),
  };
});

describe('Componente Autenticar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockDispatch.mockReset();
    mockNavigate.mockReset();
  });

  function renderComponent() {
    return render(<Autenticar />, { wrapper: reactRouterDom.BrowserRouter });
  }

  test('Exibe texto "Autenticando..." inicialmente', () => {
    mockUseSearchParams.mockReturnValue([{ get: () => null }]);
    renderComponent();
    expect(screen.getByText('Autenticando...')).toBeInTheDocument();
  });

  test('Token válido no localStorage → chama setUserLogged e navega para "/"', async () => {
    const futureDate = new Date(Date.now() + 3600000).toISOString();
    localStorage.setItem('authToken', 'token_ok');
    localStorage.setItem('authExpiresAt', futureDate);
    mockUseSearchParams.mockReturnValue([{ get: () => null }]);

    renderComponent();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        authReducers.setUserLogged({
          token: 'token_ok',
          dataHoraExpiracao: futureDate,
        }),
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('Token expirado → chama logout e navega para "/sem-acesso"', async () => {
    const pastDate = new Date(Date.now() - 3600000).toISOString();
    localStorage.setItem('authToken', 'token_expirado');
    localStorage.setItem('authExpiresAt', pastDate);
    mockUseSearchParams.mockReturnValue([{ get: () => null }]);

    renderComponent();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(authReducers.logout());
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/sem-acesso');
    });
  });

  test('Sem token e com código válido → autentica, chama setUserLogged e navega para "/"', async () => {
    const codigo = 'codigo123';
    mockUseSearchParams.mockReturnValue([
      { get: (key: string) => (key === 'codigo' ? codigo : null) },
    ]);

    (autenticacaoService.autenticarValidar as jest.Mock).mockResolvedValue({
      data: {
        token: 'token_validado',
        dataHoraExpiracao: new Date(Date.now() + 3600000).toISOString(),
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        authReducers.setUserLogged({
          token: 'token_validado',
          dataHoraExpiracao: expect.any(String),
        }),
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('Erro na autenticação com código inválido → navega para "/sem-acesso"', async () => {
    const codigo = 'codigo_invalido';
    mockUseSearchParams.mockReturnValue([
      { get: (key: string) => (key === 'codigo' ? codigo : null) },
    ]);

    (autenticacaoService.autenticarValidar as jest.Mock).mockRejectedValue(
      new Error('Invalid code'),
    );

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/sem-acesso');
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/setUserLogged' }),
    );
  });

  test('Sem token e sem código → navega para "/sem-acesso"', async () => {
    mockUseSearchParams.mockReturnValue([{ get: () => null }]);
    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/sem-acesso');
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
