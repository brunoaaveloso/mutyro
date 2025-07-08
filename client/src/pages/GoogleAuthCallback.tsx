import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Pega o token da URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // 2. Salva o token no localStorage do navegador
      localStorage.setItem("token", token);
      console.log("Token recebido e salvo com sucesso!");

      // 3. Redireciona para a página principal do usuário
      // O replace: true impede que o usuário volte para esta página com o botão "Voltar"
      navigate("/user", { replace: true });
    } else {
      // Se não houver token, redireciona para a página de login com erro
      console.error("Callback do Google sem token.");
      navigate("/login", { replace: true });
    }
    // Roda apenas uma vez, quando o componente monta
  }, [navigate, location]);

  // Pode retornar um simples loader enquanto o processo acontece
  return <div>Processando autenticação...</div>;
};

export default GoogleAuthCallback;
