import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleAuthCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token && login) {
      console.log(
        "Token recebido do URL. Iniciando processo de login no contexto..."
      );

      login(token).then(() => {
        console.log(
          "Contexto de autenticação atualizado. Redirecionando para /user."
        );
        navigate("/user", { replace: true });
      });
    } else {
      console.error(
        "Callback do Google sem token ou função de login indisponível."
      );
      navigate("/login", { replace: true });
    }
  }, [navigate, location, login]);

  return <div>Finalizando seu login...</div>;
};

export default GoogleAuthCallback;
