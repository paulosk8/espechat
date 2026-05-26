const express = require("express");
const router = express.Router();
const path = require("path");
const isLoggedIn = require("../middleware/isLoggedIn");
const views = path.join(__dirname, "/../views");

router.get("/", isLoggedIn, (req, res) => {
  res.sendFile(views + "/index.html");
});

router.get("/register", (req, res) => {
  res.sendFile(views + "/register.html");
});

const fs = require("fs");
// ... (el código existente de router.get('/', ...) y router.get('/register', ...) debe perman
/**
 * @route GET /io-test
 * @description Endpoint para demostrar la concurrencia de I/O.
 * Lee un archivo de forma asíncrona sin bloquear el Event Loop.
 */
router.get("/io-test", (req, res) => {
  // Obtenemos la ruta absoluta al package.json
  const filePath = path.join(__dirname, "..", "..", "package.json");
  // fs.readFile es una operación de I/O asíncrona.
  // Node.js delega la lectura al sistema operativo y el callback
  // se encolará en la Macrotask Queue cuando la lectura termine.
  // Mientras tanto, el Event Loop sigue libre para atender otras peticiones.
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al leer el archivo.");
    }
    res.type("json").send(data);
  });
});

/**
 * @route GET /cpu-block
 * @description Endpoint para demostrar el bloqueo del Event Loop.
 * Realiza un cálculo síncrono intensivo que acapara la CPU.
 */
router.get("/cpu-block", (req, res) => {
  // Esta función es síncrona y pesada.
  // Mientras se ejecuta, el Event Loop está completamente bloqueado
  // y no puede procesar NINGUNA otra petición (ni del chat, ni de I/O, etc).
  const resultado = calcularFibonacci(40); // Usamos un número alto para que tarde lo suficien
  res.send(`El resultado del cálculo intensivo es: ${resultado}`);
});
// Función auxiliar para simular trabajo de CPU
function calcularFibonacci(num) {
  if (num <= 1) return 1;
  return calcularFibonacci(num - 1) + calcularFibonacci(num - 2);
}

module.exports = router;
