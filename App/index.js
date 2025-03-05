import express from "express";
import pokemonRoutes from "./src/routers/pokemon.routes.js"; // Agregar extensión .js
import cors from "cors";

const app = express();
const PORT = 8081;

// Middleware para JSON
app.use(express.json());
app.use(cors());

// Usar rutas
app.use("/pokemon", pokemonRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
