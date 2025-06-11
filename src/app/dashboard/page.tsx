"use client";
import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import { database } from "../../firebase/firebase";
import { signOut } from "firebase/auth";

interface SensorData {
  bomba: boolean;
  humidade: number;
  luminosidade: number;
  movimento: boolean;
  temperatura: number;
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    bomba: false,
    humidade: 0,
    luminosidade: 0,
    movimento: false,
    temperatura: 0
  });
  const [carregando, setCarregando] = useState(true);
  const [alterandoBomba, setAlterandoBomba] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsuario(user);
        // Escutar mudanças nos dados do Firebase
        const sensorRef = ref(database, '/Dados/');
        const unsubscribeData = onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setSensorData({
              bomba: data.bomba || false,
              humidade: data.humidade || 0,
              luminosidade: data.luminosidade || 0,
              movimento: data.movimento || false,
              temperatura: data.temperatura || 0
            });
          }
          setCarregando(false);
        });

        return () => unsubscribeData();
      } else {
        window.location.href = "/login";
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleBomba = async () => {
    setAlterandoBomba(true);
    try {
      const bombaRef = ref(database, '/Dados/bomba');
      await set(bombaRef, !sensorData.bomba);
    } catch (error) {
      console.error("Erro ao alterar bomba:", error);
      alert("Erro ao alterar estado da bomba");
    } finally {
      setAlterandoBomba(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getTemperaturaColor = (temp: number) => {
    if (temp < 20) return "text-blue-300";
    if (temp < 30) return "text-green-300";
    if (temp < 35) return "text-yellow-300";
    return "text-red-300";
  };

  const getUmidadeColor = (umidade: number) => {
    if (umidade < 30) return "text-red-300";
    if (umidade < 60) return "text-yellow-300";
    return "text-blue-300";
  };

  const getLuminosidadeColor = (lum: number) => {
    if (lum < 300) return "text-purple-300";
    if (lum < 600) return "text-yellow-300";
    return "text-orange-300";
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-600 to-green-500">
        <div className="bg-white/15 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-lg">Carregando dados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-600 to-green-500 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-wide">
              Termidarium
            </h1>
            <p className="text-green-200 text-sm mt-1">
              Bem-vindo, {usuario?.displayName || usuario?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-4 py-2 rounded-lg border border-red-400/30 transition-all duration-300"
          >
            Sair
          </button>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Card Bomba */}
          <div className="bg-white/15 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Bomba d'Água</h3>
              <div className={`w-4 h-4 rounded-full ${sensorData.bomba ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            </div>
            
            <div className="text-center">
              <button
                onClick={toggleBomba}
                disabled={alterandoBomba}
                className={`w-24 h-24 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                  sensorData.bomba 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } ${alterandoBomba ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {alterandoBomba ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  <span className="text-sm font-bold">
                    {sensorData.bomba ? 'LIGADA' : 'DESLIGADA'}
                  </span>
                )}
              </button>
              <p className="text-green-200 text-sm mt-3">
                Toque para {sensorData.bomba ? 'desligar' : 'ligar'}
              </p>
            </div>
          </div>

          {/* Card Temperatura */}
          <div className="bg-white/15 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Temperatura</h3>
              <span className="text-2xl">🌡️</span>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getTemperaturaColor(sensorData.temperatura)}`}>
                {sensorData.temperatura.toFixed(1)}°C
              </div>
              <div className="text-green-200 text-sm">
                {sensorData.temperatura < 20 && "Muito Frio"}
                {sensorData.temperatura >= 20 && sensorData.temperatura < 30 && "Ideal"}
                {sensorData.temperatura >= 30 && sensorData.temperatura < 35 && "Quente"}
                {sensorData.temperatura >= 35 && "Muito Quente"}
              </div>
            </div>
          </div>

          {/* Card Umidade */}
          <div className="bg-white/15 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Umidade</h3>
              <span className="text-2xl">💧</span>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getUmidadeColor(sensorData.humidade)}`}>
                {sensorData.humidade.toFixed(0)}%
              </div>
              <div className="text-green-200 text-sm">
                {sensorData.humidade < 30 && "Muito Seco"}
                {sensorData.humidade >= 30 && sensorData.humidade < 60 && "Adequado"}
                {sensorData.humidade >= 60 && "Muito Úmido"}
              </div>
            </div>
          </div>

          {/* Card Luminosidade */}
          <div className="bg-white/15 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Luminosidade</h3>
              <span className="text-2xl">☀️</span>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getLuminosidadeColor(sensorData.luminosidade)}`}>
                {sensorData.luminosidade}
              </div>
              <div className="text-green-200 text-sm">
                {sensorData.luminosidade < 300 && "Escuro"}
                {sensorData.luminosidade >= 300 && sensorData.luminosidade < 600 && "Moderado"}
                {sensorData.luminosidade >= 600 && "Muito Claro"}
              </div>
            </div>
          </div>

          {/* Card Movimento */}
          <div className="bg-white/15 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Movimento</h3>
              <span className="text-2xl">👁️</span>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${sensorData.movimento ? 'text-red-300' : 'text-green-300'}`}>
                {sensorData.movimento ? 'DETECTADO' : 'NORMAL'}
              </div>
              <div className={`w-16 h-16 mx-auto rounded-full ${sensorData.movimento ? 'bg-red-500' : 'bg-green-500'} ${sensorData.movimento ? 'animate-pulse' : ''} flex items-center justify-center`}>
                <span className="text-white text-2xl">
                  {sensorData.movimento ? '🚨' : '✅'}
                </span>
              </div>
            </div>
          </div>

          {/* Card Status Geral */}
          <div className="bg-white/15 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Status do Sistema</h3>
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-200 text-sm">Bomba:</span>
                <span className={`font-semibold ${sensorData.bomba ? 'text-green-600' : 'text-red-600'}`}>
                  {sensorData.bomba ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-200 text-sm">Segurança:</span>
                <span className={`font-semibold ${sensorData.movimento ? 'text-red-600' : 'text-green-600'}`}>
                  {sensorData.movimento ? 'Alerta' : 'OK'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-200 text-sm">Ambiente:</span>
                <span className="font-semibold text-blue-600">
                  {sensorData.temperatura >= 20 && sensorData.temperatura <= 30 && sensorData.humidade >= 30 && sensorData.humidade <= 60 ? 'Ideal' : 'Ajustar'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-green-300/70 text-sm">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}