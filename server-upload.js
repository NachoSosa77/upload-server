// server-upload.js
import cors from "cors";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

app.use(cors());
const app = express();
const PORT = 4000;

// Carpeta para guardar archivos
const UPLOAD_DIR = path.join(process.cwd(), "archivos");

// Crear carpeta si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configuración multer para guardar archivos con su nombre original
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // Opcional: reemplazar espacios por guiones bajos
    const fileName = file.originalname.replace(/\s+/g, "_");
    cb(null, fileName);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.array("files"), (req, res) => {
  console.log("POST /upload recibido");
  const domain = "https://vps-4706926-x.dattaweb.com"; // O variable de entorno

  const archivosInfo = req.files.map((file) => {
    const url = `${domain}/archivos/${file.filename}`;
    const tipo_archivo = file.mimetype.includes("pdf") ? "pdf" : "imagen";
    return { url, tipo_archivo };
  });

  // Retornamos array de objetos (o el primero si es sólo uno)
  res.json(archivosInfo.length === 1 ? archivosInfo[0] : archivosInfo);
});

// Servir archivos estáticos para que puedan verse vía URL
app.use("/archivos", express.static(UPLOAD_DIR));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});
