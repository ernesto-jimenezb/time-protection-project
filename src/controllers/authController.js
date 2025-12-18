import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// --- VISTAS (GET) ---

// Mostrar formulario de Login
export const showLogin = (req, res) => {
    res.render("login");
};

// Mostrar formulario de Registro
export const showRegister = (req, res) => {
    res.render("register");
};

// Página del usuario (protegida)
export const userPage = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    // Buscamos al usuario para mostrar su nombre/email si fuera necesario
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    res.render("user", { user });
};

// --- LÓGICA (POST) ---

// Registrar usuario nuevo
export const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Encriptar contraseña (Requisito de seguridad)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Guardar en base de datos con Prisma
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "user" // Rol por defecto
            }
        });

        // 3. Redirigir al login
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrar: " + error.message);
    }
};

// Iniciar sesión
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar usuario
        const user = await prisma.user.findUnique({ where: { email } });

        // 2. Validar si existe y si la contraseña coincide
        if (user && (await bcrypt.compare(password, user.password))) {
            // LOGIN EXITOSO: Guardamos el ID en la sesión
            req.session.userId = user.id;
            req.session.role = user.role;
            return res.redirect("/user");
        }

        // Si falla
        res.status(401).send("Credenciales incorrectas");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
};

// Cerrar sesión
export const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};