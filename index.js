var express = require("express");
var cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

var app = express();

// Configuración del almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se almacenarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nombre del archivo
  },
  /* filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  }, */
});

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Inicializar multer con la configuración de almacenamiento
const upload = multer({ storage });

// Ruta para manejar la subida de archivos
app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha subido ningún archivo" });
  }

  const fileInfo = {
    name: req.file.filename,
    type: req.file.mimetype,
    size: req.file.size, // en bytes
  };

  // Ruta completa del archivo subido
  const filePath = path.join(__dirname, "uploads", req.file.filename);

  res.json(fileInfo);

  // Eliminar el archivo del sistema de archivos
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error al eliminar el archivo: ${err.message}`);
    } else {
      console.log(`Archivo eliminado: ${filePath}`);
    }
  });
});

// Crear la carpeta uploads si no existe
const fs = require("fs");
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
