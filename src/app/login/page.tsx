"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Image from "next/image";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa erro quando usuário começa a digitar
    if (erro) setErro("");
  };

  const validarFormulario = () => {
    if (!formData.email) {
      setErro("E-mail é obrigatório");
      return false;
    }
    if (!formData.senha) {
      setErro("Senha é obrigatória");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setCarregando(true);
    setErro("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.senha);
      window.location.href = "/dashboard";
      
    } catch (err: any) {
      console.error("Erro no login:", err);
      
      // Tratar erros específicos do Firebase
      switch (err.code) {
        case "auth/user-not-found":
          setErro("Usuário não encontrado");
          break;
        case "auth/wrong-password":
          setErro("Senha incorreta");
          break;
        case "auth/invalid-email":
          setErro("E-mail inválido");
          break;
        case "auth/user-disabled":
          setErro("Conta desabilitada");
          break;
        case "auth/too-many-requests":
          setErro("Muitas tentativas. Tente novamente mais tarde");
          break;
        default:
          setErro("Erro ao fazer login. Verifique suas credenciais.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleEsqueceuSenha = () => {
    // Implementar reset de senha se necessário
    alert("Funcionalidade de recuperação de senha em desenvolvimento");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-600 to-green-500 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo e Nome do projeto */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Image
              src="/images/logo1.png"
              alt="Termidarium Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </div>
         
          <p className="text-green-200 text-sm">
            Faça login e continue sua jornada
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white/15 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Entrar
          </h2>
          
          {/* Campo E-mail */}
          <div className="space-y-2">
            <label className="text-green-100 text-sm font-medium">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              className="w-full bg-white/20 border border-green-300/30 px-4 py-3 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              value={formData.email}
              onChange={handleInputChange}
              disabled={carregando}
            />
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <label className="text-green-100 text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                placeholder="Digite sua senha"
                className="w-full bg-white/20 border border-green-300/30 px-4 py-3 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 pr-12"
                value={formData.senha}
                onChange={handleInputChange}
                disabled={carregando}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-200 hover:text-white transition-colors"
                disabled={carregando}
              >
                {mostrarSenha ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Link esqueceu senha */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleEsqueceuSenha}
              className="text-green-200 hover:text-white text-sm transition-colors"
              disabled={carregando}
            >
              Esqueceu sua senha?
            </button>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="bg-red-500/20 border border-red-400/30 p-3 rounded-xl">
              <p className="text-red-200 text-sm text-center">{erro}</p>
            </div>
          )}

          {/* Botão de login */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-green-500 hover:from-purple-700 hover:to-green-600 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {carregando ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Entrando...</span>
              </div>
            ) : (
              "Entrar"
            )}
          </button>

          {/* Link para cadastro */}
          <div className="text-center pt-4">
            <p className="text-green-200 text-sm">
              Ainda não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => window.location.href = "/cadastro"}
                className="text-white font-semibold hover:underline transition-all"
                disabled={carregando}
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </form>

        {/* Opções extras */}
        <div className="mt-6 text-center">
          <p className="text-green-300/70 text-xs">
            Ao entrar, você concorda com nossos termos de uso
          </p>
        </div>
      </div>
    </div>
  );
}