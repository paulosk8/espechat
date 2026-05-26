const { Worker, isMainThread, workerData } = require("worker_threads");

if (isMainThread) {
  // Memoria compartida: Un espacio físico que ambos hilos pueden ver y modificar, pero con control de acceso para evitar conflictos.
  const sharedBuffer = new SharedArrayBuffer(4);
  // 4 bytes de memoria compartida
  const sharedArray = new Int32Array(sharedBuffer);
  sharedArray[0] = 100;
  // Saldo inicial de la cuenta: $100
  console.log(
    `[Monitor Principal]: Saldo Inicial Compartido: ${sharedArray[0]}`,
  );
  // Creamos un hilo para retirar dinero
  const workerRetiro = new Worker(__filename, {
    workerData: { sharedBuffer, tipo: "RETIRO", monto: 40 },
  });
  // Creamos otro hilo para depositar dinero
  const workerDeposito = new Worker(__filename, {
    workerData: { sharedBuffer, tipo: "DEPOSITO", monto: 50 },
  });
} else {
  const { sharedBuffer, tipo, monto } = workerData;
  const sharedArray = new Int32Array(sharedBuffer);
  console.log(
    `[Hilo ${tipo}]: Intentando entrar a la Zona Crítica (acceder al Monitor)...`,
  );
  // SIMULACIÓN DE UN MONITOR / SEMÁFORO USANDO ATOMICS
  // Atomics garantiza exclusión mutua: un hilo opera de forma segura sin interferencia del otro
  if (tipo === "RETIRO") {
    // Resta de forma segura dentro del monitor implícito
    Atomics.sub(sharedArray, 0, monto);
    console.log(
      `[Hilo RETIRO]: Modificación segura realizada. Restó ${monto}. Saldo actual intermedio: ${sharedArray[0]}`,
    );
  } else {
    // Añade de forma segura dentro del monitor implícito
    Atomics.add(sharedArray, 0, monto);
    console.log(
      `[Hilo DEPOSITO]: Modificación segura realizada. Sumó ${monto}. Saldo actual intermedio: ${sharedArray[0]}`,
    );
  }
}
