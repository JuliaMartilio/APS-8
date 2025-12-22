import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function FavoritosScreen() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState([]);

  // Função para carregar favoritos do AsyncStorage
  const carregarFavoritos = async () => {
    try {
      const data = await AsyncStorage.getItem("favoritos");
      if (data) {
        setFavoritos(JSON.parse(data));
      } else {
        setFavoritos([]);
      }
    } catch (error) {
      console.log("Erro ao carregar favoritos:", error);
    }
  };

  // Recarrega favoritos sempre que a tela ficar em foco
  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [])
  );

  // Seleciona cidade e volta para a tela inicial
  const selecionarCidade = (cidade : string) => {
    router.push({ pathname: "/", params: { cidade } });
  };

  // Remove cidade dos favoritos
  const removerFavorito = (cidade : string) => {
    Alert.alert(
      "Remover favorito",
      `Deseja remover ${cidade} dos favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const novosFavoritos = favoritos.filter((f) => f !== cidade);
              await AsyncStorage.setItem(
                "favoritos",
                JSON.stringify(novosFavoritos)
              );
              setFavoritos(novosFavoritos);
            } catch (error) {
              console.log("Erro ao remover favorito:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cidades Favoritas ⭐</Text>

      {favoritos.length === 0 && (
        <Text style={styles.empty}>Nenhuma cidade favoritada ainda.</Text>
      )}

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => selecionarCidade(item)}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removerFavorito(item)}
            >
              <Text style={styles.removeText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#87CEEB", paddingTop: 50 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 5,
  },
  card: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  text: { fontSize: 18, color: "#333", fontWeight: "600" },
  removeBtn: {
    marginLeft: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 12,
  },
  removeText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  empty: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    marginTop: 40,
    opacity: 0.8,
  },
});
