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
/* HELMET: Ayuda a proteger la aplicación configurando varias cabeceras HTTP de seguridad. 
   Previene ataques comunes como XSS (Cross-Site Scripting), clics maliciosos (clickjacking) 
   y asegura que el navegador no adivine el tipo de contenido (MIME sniffing).
*/
app.use(helmet()); 
app.use(express.urlencoded({ extended: true })); // Permite leer datos de formularios

// --- Configuración de Sesión Segura ---
/* SESSION: Permite almacenar datos del usuario en el servidor a través de múltiples solicitudes. 
   Asigna un ID único a cada visitante mediante una cookie, lo que permite mantener 
   el estado de autenticación (saber quién ha iniciado sesión) de forma segura.
*/
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