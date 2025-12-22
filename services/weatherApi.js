const API_BASE_URL = "http://192.168.15.185:3000/api";

export async function buscarClimaAtual(cidade) {
  const response = await fetch(
    `${API_BASE_URL}/clima?cidade=${encodeURIComponent(cidade)}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar clima");
  }

  return response.json();
}

export async function buscarPrevisao5Dias(cidade) {
  const response = await fetch(
    `${API_BASE_URL}/previsao?cidade=${encodeURIComponent(cidade)}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar previsão");
  }

  return response.json();
}
