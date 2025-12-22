import express from "express";
import { buscarClimaAtual, buscarPrevisao5Dias } from "../services/weatherService.js";

const router = express.Router();

router.get("/clima", async (req, res) => {
  try {
    const { cidade } = req.query;
    const dados = await buscarClimaAtual(cidade, process.env.OPENWEATHER_API_KEY);
    res.json(dados);
  } catch (e) {
    res.status(500).json({ erro: "Erro ao buscar clima" });
  }
});

router.get("/previsao", async (req, res) => {
  try {
    const { cidade } = req.query;
    const dados = await buscarPrevisao5Dias(cidade, process.env.OPENWEATHER_API_KEY);
    res.json(dados);
  } catch (e) {
    res.status(500).json({ erro: "Erro ao buscar previsão" });
  }
}); 

export default router;
