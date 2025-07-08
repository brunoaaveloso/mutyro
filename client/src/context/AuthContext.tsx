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

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await customFetch.get("/usuarios/atual-usuario");
      setUsuario(data.usuario);
    } catch (error) {
      setUsuario(null);
      localStorage.removeItem("token");
    }
  }, []);

  const login = useCallback(
    async (token: string) => {
      localStorage.setItem("token", token);
      await fetchCurrentUser();
    },
    [fetchCurrentUser]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    }
    setIsLoading(false);
  }, [fetchCurrentUser]);

  const logout = useCallback(async () => {
    try {
      await customFetch.get("/auth/logout");
      setUsuario(null);
      localStorage.removeItem("token");
      toast.success("Logout realizado com sucesso!");
      // Força um redirecionamento para garantir que o estado seja limpo em toda a aplicação
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isLoading }}>
      {/* Não mostra nada até que a verificação inicial do usuário seja concluída */}
      {!isLoading && children}
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
