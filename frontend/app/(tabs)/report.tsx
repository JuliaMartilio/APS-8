import React, { useState } from "react";
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
import { buscarPrevisao5Dias } from "../../services/weatherApi";
import { gerarRelatorioPDF } from "../../utils/gerarRelatorioPDF";

export default function RelatorioScreen() {
  const [cidade, setCidade] = useState("");
  const [carregando, setCarregando] = useState(false);

  const gerarRelatorio = async () => {
    if (!cidade.trim()) {
      Alert.alert("Erro", "Digite o nome de uma cidade.");
      return;
    }

    setCarregando(true);
    try {
      const previsao = await buscarPrevisao5Dias(cidade);
      await gerarRelatorioPDF(cidade, previsao);
      Alert.alert("Sucesso", `Relatório de ${cidade} gerado com sucesso!`);
    } catch (erro) {
      console.error("Erro ao gerar relatório:", erro);
      Alert.alert("Erro", "Não foi possível gerar o relatório.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Relatório Climático 🌤️</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Digite o nome da cidade"
          placeholderTextColor="#555"
          style={styles.input}
          value={cidade}
          onChangeText={setCidade}
        />
        <TouchableOpacity style={styles.button} onPress={gerarRelatorio}>
          {carregando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Gerar Relatório</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.info}>
        O relatório será gerado em PDF com a previsão de 5 dias.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  searchContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1E90FF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  info: {
    marginTop: 25,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    opacity: 0.9,
  },
});
