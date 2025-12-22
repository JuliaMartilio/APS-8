import express from "express";
import weatherRoutes from "./routes/weatherRoutes.js";

const app = express();

app.use(express.json());
app.use("/api", weatherRoutes);
app.get("/", (req, res) => {
    res.send("Backend do clima rodando 🚀");
  });

export default app;
