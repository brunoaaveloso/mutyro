import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

type Usuario = {
  _id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  cpf: string;
  endereco: string;
  dataNascimento: string;
  avatar?: string;
};

type AuthContextType = {
  usuario: Usuario | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar o usuário atual, agora reutilizável
  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await customFetch.get("/usuarios/atual-usuario");
      setUsuario(data.usuario);
    } catch (error) {
      // Se a busca falhar (ex: token inválido), desloga o usuário
      setUsuario(null);
      localStorage.removeItem("token");
    }
  }, []);

  // Nova função para lidar com o login
  const login = async (token: string) => {
    // 1. Salva o novo token no localStorage
    localStorage.setItem("token", token);
    // 2. Imediatamente busca os dados completos do usuário usando o novo token
    await fetchCurrentUser();
  };

  // Verifica o usuário no carregamento inicial da página
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  const logout = async () => {
    try {
      await customFetch.get("/auth/logout");
      setUsuario(null);
      localStorage.removeItem("token");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    } finally {
      // Redireciona para a home após o logout para garantir a atualização
      window.location.href = "/";
    }
  };

  // Log para depuração
  useEffect(() => {
    if (!isLoading) {
      console.log("Estado de autenticação finalizado. Usuário:", usuario);
    }
  }, [usuario, isLoading]);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isLoading }}>
      {isLoading ? <div>Carregando...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
