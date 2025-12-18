import express from "express";
// Importamos las funciones del controlador que acabamos de crear
import { showLogin, showRegister, registerUser, loginUser, logoutUser, userPage } from "../controllers/authController.js";
// Importamos el middleware de seguridad (el detector de bots)
import { timeProtection } from "../middleware/timeProtection.js";

const router = express.Router();

// Rutas GET (Para mostrar los formularios)
router.get("/login", showLogin);
router.get("/register", showRegister);
router.get("/user", userPage);
router.get("/logout", logoutUser);

// Rutas POST (Aquí aplicamos la protección de tiempo)
// OJO: timeProtection va ANTES de la lógica de login/registro
router.post("/login", timeProtection, loginUser);
router.post("/register", timeProtection, registerUser);
// Redirigir la raíz al login
router.get("/", (req, res) => res.redirect("/login"));
export default router;