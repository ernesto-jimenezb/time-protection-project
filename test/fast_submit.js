import fetch from "node-fetch";

const loginURL = "http://localhost:3000/login";

async function simulateFastSubmit() {
    console.log("--- INICIANDO ATAQUE DE BOT (CON MEMORIA DE COOKIES) ---");
    
    // Variable para guardar la cookie de sesión
    let sessionCookie = null;

    for (let i = 0; i < 3; i++) {
        // Preparamos las cabeceras
        const headers = { 
            "Content-Type": "application/x-www-form-urlencoded" 
        };
        
        // Si ya tenemos cookie de una petición anterior, la enviamos
        if (sessionCookie) {
            headers["Cookie"] = sessionCookie;
        }

        try {
            const res = await fetch(loginURL, {
                method: "POST",
                headers: headers,
                body: "email=bot@prueba.com&password=password123"
            });

            // Si el servidor nos da una cookie nueva, la guardamos
            const newCookie = res.headers.get("set-cookie");
            if (newCookie) {
                // Limpiamos la cookie para quedarnos solo con lo importante
                sessionCookie = newCookie.split(";")[0];
            }

            console.log(`Envío #${i + 1} | Código: ${res.status}`);
            
            // Leemos la respuesta para ver si nos bloquearon
            const text = await res.text();
            if (res.status === 403) {
                console.log(">> ¡ÉXITO! BLOQUEO DETECTADO <<");
                console.log("Mensaje del servidor:", text);
            } else {
                console.log("Estado: Pasó (o credenciales incorrectas)");
            }
            console.log("------------------------------------------------");

        } catch (error) {
            console.error("Error en el envío:", error.message);
        }
    }
}

simulateFastSubmit();