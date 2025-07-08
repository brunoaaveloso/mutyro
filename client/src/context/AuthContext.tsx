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
  setUsuario: (usuario: Usuario | null) => void;
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchCurrentUser();
  };

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
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  const contextValue = { usuario, setUsuario, login, logout, isLoading };

  return (
    <AuthContext.Provider value={contextValue}>
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
