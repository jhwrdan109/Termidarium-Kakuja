"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../../firebase/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  // Hook do Next.js para navegação
  const router = useRouter();

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
    if (!formData.nome.trim()) {
      setErro("Nome é obrigatório");
      return false;
    }
    if (!formData.email) {
      setErro("E-mail é obrigatório");
      return false;
    }
    if (formData.senha.length < 6) {
      setErro("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem");
      return false;
    }
    return true;
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setCarregando(true);
    setErro("");

    try {
      console.log("Iniciando cadastro...");
      
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.senha
      );
      
      const user = userCredential.user;
      console.log("Usuário criado:", user.uid);

      // Atualizar perfil do usuário com o nome
      await updateProfile(user, {
        displayName: formData.nome
      });
      console.log("Perfil atualizado");

      // Salvar dados adicionais no Realtime Database
      await set(ref(database, `usuarios/${user.uid}`), {
        nome: formData.nome,
        email: formData.email,
        criadoEm: new Date().toISOString(),
        ativo: true
      });
      console.log("Dados salvos no database");

      // Tentar múltiplas formas de navegação
      console.log("Redirecionando para dashboard...");
      
      // Método 1: Next.js Router (preferido)
      try {
        router.push("/dashboard");
        console.log("Router.push executado");
      } catch (routerError) {
        console.log("Erro no router.push, tentando window.location");
        // Método 2: Fallback para window.location
        window.location.href = "/dashboard";
      }
      
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      
      // Tratar erros específicos do Firebase
      switch (err.code) {
        case "auth/email-already-in-use":
          setErro("Este e-mail já está em uso");
          break;
        case "auth/invalid-email":
          setErro("E-mail inválido");
          break;
        case "auth/weak-password":
          setErro("Senha muito fraca");
          break;
        default:
          setErro(`Erro ao criar conta: ${err.message}`);
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleGoToLogin = () => {
    console.log("Navegando para login...");
    try {
      router.push("/login");
    } catch (error) {
      console.log("Erro no router, usando window.location");
      window.location.href = "/login";
    }
  };

  return (
    <div style={{backgroundImage: "url('images/8647.jpg')"}} className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-600 to-green-500 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo e Nome do projeto */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <Image
              src="/images/logo1.png"
              alt="Termidarium Logo"
              width={100}
              height={100}
              className="rounded-full shadow-lg"
            />
          </div>
          
          <p className="text-green-200 text-sm">
            Crie sua conta e comece sua jornada
          </p>
        </div>

        <form
          onSubmit={handleCadastro}
          className="bg-white/15 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Cadastro
          </h2>
          
          {/* Campo Nome */}
          <div className="space-y-2">
            <label className="text-green-100 text-sm font-medium">
              Nome completo
            </label>
            <input
              type="text"
              name="nome"
              placeholder="Digite seu nome completo"
              className="w-full bg-white/20 border border-green-300/30 px-4 py-3 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              value={formData.nome}
              onChange={handleInputChange}
              disabled={carregando}
            />
          </div>

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

          {/* Campo Confirmar Senha */}
          <div className="space-y-2">
            <label className="text-green-100 text-sm font-medium">
              Confirmar senha
            </label>
            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirme sua senha"
              className="w-full bg-white/20 border border-green-300/30 px-4 py-3 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              value={formData.confirmarSenha}
              onChange={handleInputChange}
              disabled={carregando}
            />
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="bg-red-500/20 border border-red-400/30 p-3 rounded-xl">
              <p className="text-red-200 text-sm text-center">{erro}</p>
            </div>
          )}

          {/* Botão de cadastro */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-green-500 hover:from-purple-700 hover:to-green-600 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {carregando ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Criando conta...</span>
              </div>
            ) : (
              "Criar Conta"
            )}
          </button>

          {/* Link para login */}
          <div className="text-center pt-4">
            <p className="text-green-200 text-sm">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={handleGoToLogin}
                className="text-white font-semibold hover:underline transition-all"
                disabled={carregando}
              >
                Faça login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}