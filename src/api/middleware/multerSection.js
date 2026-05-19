const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");

// Configuración de almacenamiento dinámico según la sección
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const section = req.params.section;
    const dest = path.join(__dirname, "..", "..", "data", "images", section);
    try {
      await fs.mkdir(dest, { recursive: true });
      cb(null, dest);
    } catch (err) {
      cb(err, dest);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
