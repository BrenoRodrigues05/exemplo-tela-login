"use client"; 

// Importa o hook useRouter do Next.js para navegação programática
import { useRouter } from "next/router";

// Importa o hook useState do React para gerenciar estados locais do componente
import { useState } from "react";

// Exporta o componente principal da página (Home)
export default function Home() {

  // Estado para armazenar o nome de usuário digitado
  const [username, setUsername] = useState("");

  // Estado para armazenar a senha digitada
  const [password, setPassword] = useState("");

  // Estado para controlar o carregamento (ex: botão de login desabilitado durante requisição)
  const [loading, setLoading] = useState(false);

  // Estado para armazenar mensagens de erro, caso algo dê errado
  const [error, setError] = useState("");

  // Hook do Next.js usado para redirecionar o usuário após login, por exemplo
  //const router = useRouter();

  /**
   * Função executada ao enviar o formulário de login.
   * Ela evita o comportamento padrão do form, envia os dados para a API
   * e trata possíveis erros de forma elegante.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o reload da página
    setError("");       // Limpa erros anteriores
    setLoading(true);   // Ativa o estado de carregamento

    try {
      // Faz uma requisição POST para o endpoint de login da API
      const response = await fetch("https://localhost:7026/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Envia os dados do usuário
      });

      // Se a resposta não for "ok", lança um erro customizado
      if (!response.ok) throw new Error("Usuário ou senha inválidos");

      // Converte a resposta para JSON e extrai o token JWT
      const data = await response.json();

      // Armazena o token no localStorage para autenticação futura
      localStorage.setItem("token", data.token);

      // Exibe uma mensagem de sucesso
      alert("Login realizado com sucesso!");

      // (Opcional) Redirecionar o usuário para outra página, ex:
      //router.push("/dashboard");
    } 
    catch (err: unknown) {
      // Verifica se o erro é uma instância de Error para acessar a mensagem
      if (err instanceof Error) setError(err.message);
      else setError("Erro inesperado");
    } 
    finally {
      // Independente do resultado, desativa o estado de carregamento
      setLoading(false);
    }
  };

  // Renderização do componente
  return (
    <div>
      {/* Exemplo de formulário SIMPLES de login */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Exibe mensagem de erro, se existir */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
