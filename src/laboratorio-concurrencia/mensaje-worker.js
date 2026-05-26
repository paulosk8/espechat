const { parentPort } = require("worker_threads");

// El receptor espera un "mensaje" en su buzón
parentPort.on("message", (mensajeRecibido) => {
  console.log(
    `[Worker - Receptor]: He recibido el mensaje: "${mensajeRecibido}"`,
  );

  // Procesamiento asíncrono: responde después de 2 segundos
  setTimeout(() => {
    const respuesta =
      mensajeRecibido.toUpperCase() + " - PROCESADO EXITOSAMENTE";
    console.log(`[Worker]: Enviando mensaje de vuelta al hilo principal...`);
    parentPort.postMessage(respuesta);
  }, 2000);
});
