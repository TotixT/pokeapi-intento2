import express from "express";
import { getRandomPokemon, selectType, confirmTypeSelection  } from "../controllers/pokemon.controller.js"; // Importar el controlador

const router = express.Router();

// Ruta de prueba para Pokémon aleatorio
router.get("/pokemonRandom", getRandomPokemon);

// Ruta para seleccionar el Tipo
router.get("/selectType/:pokemonId", selectType);
router.post("/confirmTypeSelection", confirmTypeSelection);
//router.post("/selectType", selectType); // Prueba mandando un pokemon desde el back sin validar nada con el Front

export default router;
