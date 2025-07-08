import Wrapper from "../assets/wrappers/LandingPage";
import { Hero, Blog } from "../components";

import { useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";

export const loader = async () => {
  try {
    const res = await customFetch("/mutiroes/todos");
    return { mutiroes: res.data.mutiroes };
  } catch (err) {
    console.error("Erro ao carregar mutirões:", err);
    return { mutiroes: [] };
  }
};

interface Mutirao {
  _id: string;
  titulo: string;
  data: string;
  descricao: string;
  imagemCapa: string;
  criadoPor?: { nome: string } | string;
}

const Landing = () => {
  const { mutiroes } = useLoaderData() as { mutiroes: Mutirao[] };

  return (
    <Wrapper>
      <div className="container">
        {/* <NavBar /> */}
        <Hero />
        <Blog mutiroes={mutiroes} />
      </div>
    </Wrapper>
  );
};

export default Landing;
