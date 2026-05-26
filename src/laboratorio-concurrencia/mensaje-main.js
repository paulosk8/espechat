const { Worker } = require("worker_threads");
const path = require("path");

console.log("[Principal]: Iniciando el sistema de Paso de Mensajes Asíncrono.");

// Se crea el canal de comunicación
const worker = new Worker(path.join(__dirname, "mensaje-worker.js"));

// Definimos qué hacer cuando llegue un mensaje de respuesta (Asíncrono)
worker.on("message", (resultado) => {
  console.log(
    `[Principal - Receptor]: Mensaje final recibido del Worker: "${resultado}"`,
  );
  process.exit();
});

console.log(
  "[Principal]: Enviando mensaje al Worker (Sincronización por paso de mensajes)...",
);
worker.postMessage("hola estudiantes de computación paralela");
console.log(
  "[Principal]: Mensaje enviado. El hilo principal sigue libre y no se bloquea.",
);
