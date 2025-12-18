import express from "express";
const router = express.Router();

// Ruta simple de ejemplo (GET)
router.get("/", (req, res) => {
    res.send("¡El servidor está funcionando correctamente!");
});

// Ejemplo de otra ruta para una página de inicio de sesión
router.get("/login", (req, res) => {
    res.render("login"); // Esto buscará el archivo login.ejs en tu carpeta de vistas
});

export default router;