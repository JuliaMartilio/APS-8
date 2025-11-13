import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const gerarRelatorioPDF = async (cidade, previsao) => {
  const diasAgrupados = previsao.list.reduce((acc, item) => {
    const data = item.dt_txt.split(" ")[0];
    if (!acc[data]) acc[data] = [];
    acc[data].push(item);
    return acc;
  }, {});

  let conteudoHTML = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #0077cc; }
          h2 { margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h1>Relatório Climático - ${cidade}</h1>
        <p>Previsão dos próximos 5 dias</p>
  `;

  for (const [data, leituras] of Object.entries(diasAgrupados)) {
    conteudoHTML += `<h2>${data}</h2><table><tr><th>Hora</th><th>Temp (°C)</th><th>Descrição</th></tr>`;
    for (const leitura of leituras) {
      conteudoHTML += `
        <tr>
          <td>${leitura.dt_txt.split(" ")[1]}</td>
          <td>${leitura.main.temp.toFixed(1)}</td>
          <td>${leitura.weather[0].description}</td>
        </tr>
      `;
    }
    conteudoHTML += `</table>`;
  }

  conteudoHTML += `</body></html>`;

  const { uri } = await Print.printToFileAsync({ html: conteudoHTML });
  await Sharing.shareAsync(uri);
};
