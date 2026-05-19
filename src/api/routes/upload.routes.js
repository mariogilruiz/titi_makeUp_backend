const express = require("express");
const upload = require("../middleware/multerSection");
const path = require("path");

const router = express.Router();

// Subida de imagen a una sección específica
router.post("/:section", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se subió ninguna imagen" });
  }
  res.json({
    message: "Imagen subida correctamente",
    filename: req.file.filename,
    section: req.params.section,
    url: `/images/${req.params.section}/${req.file.filename}`,
  });
});

module.exports = router;
