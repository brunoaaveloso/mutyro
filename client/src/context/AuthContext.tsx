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

// Seus tipos
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

// ### CORREÇÃO #1 ###
// Adicionamos 'setUsuario' de volta ao tipo do contexto
type AuthContextType = {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void; // <--- ADICIONADO DE VOLTA
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // A função fetchCurrentUser com useCallback está correta para evitar loops
  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await customFetch.get("/usuarios/atual-usuario");
      setUsuario(data.usuario);
    } catch (error) {
      setUsuario(null);
      localStorage.removeItem("token");
    }
  }, []);

  // A função login com useCallback está correta
  const login = useCallback(
    async (token: string) => {
      localStorage.setItem("token", token);
      await fetchCurrentUser();
    },
    [fetchCurrentUser]
  );

  // A função logout com useCallback está correta
  const logout = useCallback(async () => {
    try {
      await customFetch.get("/auth/logout");
      setUsuario(null);
      localStorage.removeItem("token");
      toast.success("Logout realizado com sucesso!");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  }, []);

  // O useEffect inicial está correto
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  // ### CORREÇÃO #2 ###
  // Adicionamos 'setUsuario' de volta ao valor que o Provider oferece
  const contextValue = { usuario, setUsuario, login, logout, isLoading };

  return (
    <AuthContext.Provider value={contextValue}>
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
