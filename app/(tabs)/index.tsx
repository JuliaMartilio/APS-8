import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { OPENWEATHER_API_KEY } from "../../config/api";
import { buscarClimaAtual } from "../../services/weatherApi";

export default function WeatherScreen() {
  const params = useLocalSearchParams<{ cidade?: string }>();
  const cidadeParam = params?.cidade;

  const [cidade, setCidade] = useState("São Paulo");
  const [clima, setClima] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (cidadeParam) {
      setCidade(cidadeParam);
      buscarDadosClima(cidadeParam);
    } else {
      buscarDadosClima(cidade);
    }
  }, [cidadeParam]);

  const buscarDadosClima = async (nomeCidade: string) => {
    try {
      setCarregando(true);
      setErro(null);

      if (!nomeCidade) return;

      const dados = await buscarClimaAtual(nomeCidade, OPENWEATHER_API_KEY);
      setClima(dados);
      setCidade(nomeCidade);
    } catch (error: any) {
      console.log("Erro ao buscar clima:", error);
      setErro(error.message);
      Alert.alert("Erro", "Cidade não encontrada");
    } finally {
      setCarregando(false);
    }
  };

  const salvarFavorito = async () => {
    try {
      const data = await AsyncStorage.getItem("favoritos");
      const favoritosAtuais: string[] = data ? JSON.parse(data) : [];

      if (!favoritosAtuais.includes(cidade)) {
        favoritosAtuais.push(cidade);
        await AsyncStorage.setItem("favoritos", JSON.stringify(favoritosAtuais));
        Alert.alert("✅ Sucesso", `${cidade} foi adicionada aos favoritos`);
      } else {
        Alert.alert("ℹ️", "Essa cidade já está nos favoritos");
      }
    } catch (error) {
      console.log("Erro ao salvar favorito:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Previsão do Tempo</Text>

      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar cidade..."
          style={styles.input}
          value={busca}
          onChangeText={setBusca}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => buscarDadosClima(busca)}
        >
          <Text style={styles.searchText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Card de clima */}
      <View style={styles.card}>
        {carregando ? (
          <>
            <ActivityIndicator size="large" />
            <Text style={styles.carregando}>Carregando...</Text>
          </>
        ) : erro || !clima ? (
          <>
            <Text style={styles.erro}>Erro ao carregar dados</Text>
            <TouchableOpacity onPress={() => buscarDadosClima(cidade)}>
              <Text style={styles.instrucao}>Tentar novamente</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.temp}>{clima.temperatura}°C</Text>
            <Text style={styles.city}>
              {clima.cidade}, {clima.pais}
            </Text>
            <Text style={styles.desc}>{clima.descricao}</Text>

            <View style={styles.infoAdicional}>
              <Text style={styles.info}>
                Máx: {clima.tempMax}°C | Mín: {clima.tempMin}°C
              </Text>
              <Text style={styles.info}>Umidade: {clima.umidade}%</Text>
              <Text style={styles.info}>Vento: {clima.vento} m/s</Text>
            </View>

            <TouchableOpacity style={styles.favoriteBtn} onPress={salvarFavorito}>
              <Text style={styles.favoriteText}>⭐ Favoritar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    width: 200,
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: "#005f87",
    padding: 10,
    borderRadius: 10,
  },
  searchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: 300,
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  city: {
    fontSize: 20,
    marginTop: 10,
    color: "#555",
  },
  desc: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
    textTransform: "capitalize",
  },
  infoAdicional: {
    marginTop: 20,
    alignItems: "center",
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  carregando: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  erro: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  instrucao: {
    textDecorationLine: "underline",
    color: "#005f87",
    marginTop: 10,
  },
  favoriteBtn: {
    marginTop: 20,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
  },
  favoriteText: {
    fontWeight: "bold",
  },
});
