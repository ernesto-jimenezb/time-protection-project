import express from "express";
import session from "express-session";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Importamos las rutas (que crearemos en el siguiente paso)
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config(); // Cargar variables de entorno

const app = express();
const prisma = new PrismaClient();

// --- Módulos de Seguridad ---
app.use(helmet()); // Protege cabeceras HTTP [cite: 117]
app.use(express.urlencoded({ extended: true })); // Permite leer datos de formularios

// --- Configuración de Sesión Segura ---
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Evita acceso a cookie desde JS del cliente
    sameSite: "strict" // Protección contra CSRF
  }
}));

// --- Configuración de Vistas EJS ---
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

// --- Rutas ---
app.use("/", authRoutes);
app.use("/admin", adminRoutes);

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});