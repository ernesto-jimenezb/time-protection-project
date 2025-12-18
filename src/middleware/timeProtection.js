export function timeProtection(req, res, next) {
    // Obtenemos la última vez que hizo una petición (o 0 si es la primera vez)
    const lastTime = req.session.lastRequestTime || 0;
    
    // Obtenemos la hora actual en milisegundos
    const now = Date.now();
    
    // Calculamos cuánto tiempo pasó
    const elapsed = now - lastTime;
    
    // Actualizamos la hora de la última petición para la próxima vez
    req.session.lastRequestTime = now;
    
    // REGLA: Si pasaron menos de 1000ms (1 segundo), es un bot o script
    if (elapsed < 1000) {
        console.warn("ALERTA: Bot detectado en IP " + req.ip)
        return res.status(403).send("Acción sospechosa detectada.");
    }
    
    // Si todo está bien, dejamos pasar la petición
    next();
}