//-----importaciones
const express = require("express");
require("dotenv").config();

const cors = require("cors");

//-----importar rutas
const datasRoutes = require("./src/api/routes/datas.routes");
//-----configuraciones
const app = express();
app.use(express.json());
app.use(cors());

//-----inicio de rutas
app.get("/", (req, res) => {
  res.send("Hola mundo");
});

//-----endpoints

app.use("/data", datasRoutes);

//-----iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Hola Mario el Servidor escuchando en el puerto ${PORT}`);
});
