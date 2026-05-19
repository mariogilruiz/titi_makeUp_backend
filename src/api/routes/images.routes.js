const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const router = express.Router();

// Endpoint dinámico para servir imágenes por sección y nombre
router.get("/:section/:imageName", async (req, res) => {
  const { section, imageName } = req.params;
  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "images",
    section,
    imageName
  );
  try {
    // Verifica si el archivo existe
    await fs.access(imagePath);
    res.sendFile(imagePath);
  } catch (err) {
    res.status(404).json({ message: "Imagen no encontrada" });
  }
});

module.exports = router;
