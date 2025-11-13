/**
 * Serviço para fazer requisições na API do OpenWeatherMap
 */

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Busca o clima atual de uma cidade
 * @param {string} cidade - Nome da cidade (ex: "São Paulo" ou "São Paulo,BR")
 * @param {string} apiKey - Chave da API do OpenWeatherMap
 * @returns {Promise<Object>} Dados do clima
 */
export async function buscarClimaAtual(cidade, apiKey) {
  try {
    // Codifica a cidade para URL
    const cidadeCodificada = encodeURIComponent(cidade);
    
    // Faz a requisição na API
    const response = await fetch(
      `${BASE_URL}/weather?q=${cidadeCodificada}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
       throw new Error(`Erro ao buscar clima: ${response.status}`);
    }

    const data = await response.json();
    
    // Retorna os dados formatados
    return {
      temperatura: Math.round(data.main.temp),
      sensacaoTermica: Math.round(data.main.feels_like),
      descricao: data.weather[0].description,
      cidade: data.name,
      pais: data.sys.country,
      umidade: data.main.humidity,
      vento: data.wind?.speed || 0,
      icone: data.weather[0].icon,
      tempMax: Math.round(data.main.temp_max),
      tempMin: Math.round(data.main.temp_min),
    };
  } catch (error) {
    console.error('Erro ao buscar clima:', error);
    throw error;
  }
}

/**
 * Busca a previsão do tempo para os próximos 5 dias (dados a cada 3 horas)
 * usando a API do OpenWeatherMap.
 *
 * @async
 * @function buscarPrevisao5Dias
 * @param {string} cidade - Nome da cidade para buscar a previsão.
 * @returns {Promise<Object>} Um objeto contendo os dados da previsão retornados pela API.
 * @throws {Error} Lança um erro se a requisição falhar ou se a cidade não for encontrada.
 */
export const buscarPrevisao5Dias = async (cidade, apiKey) => {
    try {
      const cidadeCodificada = encodeURIComponent(cidade);
      const url = `${BASE_URL}/forecast?q=${cidadeCodificada}&units=metric&lang=pt_br&appid=${apiKey}`;
  
      const resposta = await fetch(url);
      if (!resposta.ok) {
        throw new Error('Erro ao buscar previsão: ' + resposta.status);
      }
  
      const dados = await resposta.json();
      return dados;
    } catch (erro) {
      console.error('Erro ao buscar previsão:', erro);
      throw erro;
    }
  };


