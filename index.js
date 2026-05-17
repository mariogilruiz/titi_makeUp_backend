//-----importaciones
const express = require("express");
require("dotenv").config();

const cors = require("cors");

//-----importar rutas
const datasRoutes = require("./src/api/routes/datas.routes");
const mailRoutes = require("./src/api/routes/mail.routes");

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const API_SECRET = process.env.API_SECRET;

//-----configuraciones
const app = express();
app.use(express.json());

// Habilita CORS
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Accept", "Content-Type", "x-api-key"],
  }),
);

function requireApiKey(req, res, next) {
  if (!API_SECRET) {
    return res
      .status(500)
      .json({ message: "Falta API_SECRET en variables de entorno" });
  }

  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== API_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
}

//-----inicio de rutas
app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

//-----endpoints
app.use("/data", requireApiKey, datasRoutes);
app.use("/contact", mailRoutes);

//-----iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Hola Mario el Servidor escuchando en el puerto ${PORT}`);
});
