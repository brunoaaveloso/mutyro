import { FormRow } from "../components";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { Form, useNavigate, useLocation } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

type ApiError = {
  response?: {
    data?: {
      msg?: string;
    };
  };
  message?: string;
};

type Props = {
  switchToRegister?: () => void;
  closeModal?: () => void;
};

const Login = ({ switchToRegister, closeModal }: Props) => {
  const { setUsuario } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      console.log("Enviando dados para login:", data);
      const response = await customFetch.post("/auth/login", data);
      console.log("Resposta completa do login:", response);

      // Direcionamento de navegação após o login padrão /user ou do .from
      const from = location.state?.from || "/user";

      if (response.data && response.data.usuario) {
        console.log("Dados do usuário recebidos:", response.data.usuario);
        setUsuario(response.data.usuario);
        toast.success("Login feito com sucesso!");
        if (closeModal) closeModal();
        navigate(from, { replace: true });
      } else {
        console.log("Tentando buscar usuário atual...");
        const userResponse = await customFetch.get("/usuarios/atual-usuario");
        console.log("Resposta do usuário atual:", userResponse);

        if (userResponse.data && userResponse.data.usuario) {
          console.log(
            "Dados do usuário atual recebidos:",
            userResponse.data.usuario
          );
          setUsuario(userResponse.data.usuario);
          toast.success("Login feito com sucesso!");
          if (closeModal) closeModal();
          navigate(from, { replace: true });
        } else {
          throw new Error("Não foi possível obter os dados do usuário");
        }
      }
    } catch (error) {
      console.error("Erro detalhado no login:", error);
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.msg ||
          apiError?.message ||
          "Erro desconhecido ao tentar fazer login"
      );
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit} className="form">
        <h4>Login</h4>
        <FormRow
          placeHolder="Usuário ou Email"
          type="email"
          name="email"
          //defaultValue="grosbilda@gmail.com"
        />
        <FormRow
          placeHolder="Senha"
          type="password"
          name="senha"
          //defaultValue="secret123"
        />
        <button type="submit" className="btn btn-block">
          Login
        </button>
        <a href="/redefinir-senha" className="link-esqueci">
          Esqueceu sua senha?
        </a>
        <div className="divider">
          <div className="line"></div>
          <span>ou</span>
          <div className="line"></div>
        </div>
        <button
          type="button"
          className="btn btn-link"
          onClick={() => {
            window.location.href = "/api/auth/google";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            ></path>
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            ></path>
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            ></path>
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            ></path>
          </svg>
          Continuar com Google
        </button>
        <button
          type="button"
          className="btn btn-link"
          onClick={switchToRegister}
        >
          Criar uma conta
        </button>
      </Form>
    </Wrapper>
  );
};

export default Login;
