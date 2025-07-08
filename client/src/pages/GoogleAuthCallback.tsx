import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token && auth) {
      // 1. Salva o token no localStorage
      localStorage.setItem("token", token);
      console.log("Token recebido do URL e salvo no localStorage.");

      // 2. ATUALIZA O ESTADO GLOBAL DA APLICAÇÃO
      auth.login(token);

      console.log("Contexto de autenticação atualizado.");

      navigate("/user", { replace: true });
    } else {
      console.error(
        "Callback do Google sem token ou contexto de autenticação indisponível."
      );
      navigate("/login", { replace: true });
    }
  }, [navigate, location, auth]);

  return <div>Finalizando seu login...</div>;
};

export default GoogleAuthCallback;
