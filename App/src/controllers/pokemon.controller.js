import axios from "axios";

export const getRandomPokemon = async (req, res) => {
  try {
    // Obtener la cantidad total de Pokémon
    const speciesResponse = await axios.get("https://pokeapi.co/api/v2/pokemon-species/");
    const totalPokemon = speciesResponse.data.count; // Número total de Pokémon

    // Generar un ID aleatorio basado en el total de Pokémon disponibles
    const randomId = Math.floor(Math.random() * totalPokemon) + 1;

    // Obtener los datos del Pokémon aleatorio
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemonData = response.data;

    // Obtener la información de la especie del Pokémon
    const speciesData = await axios.get(pokemonData.species.url);

    // Determinar la rareza del Pokémon
    let rareza = "Común";
    if (speciesData.data.is_legendary) rareza = "Legendario";
    if (speciesData.data.is_mythical) rareza = "Mítico";

    // Obtener las debilidades del Pokémon según su tipo
    const debilidades = new Set(); // Usamos un Set para evitar duplicados
    for (const tipo of pokemonData.types) {
      const tipoResponse = await axios.get(tipo.type.url);
      tipoResponse.data.damage_relations.double_damage_from.forEach((weakness) => {
        debilidades.add(weakness.name);
      });
    }

    // Construir el objeto final del Pokémon
    const pokemon = {
      id: pokemonData.id,
      name: pokemonData.name,
      image: pokemonData.sprites.front_default,
      types: pokemonData.types.map((t) => t.type.name),
      debilidades: [...debilidades], // Convertimos el Set en un array
      rareza: rareza,
    };

    generatedPokemons.set(pokemon.id, pokemon);

    res.json(pokemon);
  } catch (error) {
    console.error("Error al obtener el Pokémon:", error);
    res.status(500).json({ error: "Error al obtener el Pokémon" });
  }
};

// 🟢 Obtener el Pokémon generado en el frontend
export const selectType = async (req, res) => {
  const { pokemonId } = req.params;

  try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemonData = response.data;

      const pokemon = {
          id: pokemonData.id,
          name: pokemonData.name,
          image: pokemonData.sprites.front_default,
          availableTypes: pokemonData.types.map(t => t.type.name)
      };

      res.json({
          message: "Selecciona un tipo para este Pokémon",
          pokemon
      });
  } catch (error) {
      console.error("Error al obtener el Pokémon:", error);
      res.status(500).json({ error: "Error al obtener el Pokémon" });
  }
};


// 🟢 Confirmar selección del tipo
const generatedPokemons = new Map(); // Guardará los Pokémon generados temporalmente
const selectedPokemons = new Map(); // Aquí almacenamos los Pokémon con su tipo confirmado

export const confirmTypeSelection = (req, res) => {
  const { pokemonId, selectedType } = req.body;

  if (!pokemonId || !selectedType) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  // Buscar el Pokémon en la memoria temporal
  const pokemon = generatedPokemons.get(parseInt(pokemonId));

  if (!pokemon) {
    return res.status(404).json({ error: "Pokémon no encontrado" });
  }

  // Validar si el selectedType pertenece a los tipos del Pokémon
  if (!pokemon.types.includes(selectedType)) {
    return res.status(400).json({ error: "El tipo seleccionado no pertenece a este Pokémon" });
  }

  // Guardamos el Pokémon con su tipo seleccionado en el Map
  selectedPokemons.set(pokemonId, { id: pokemon.id, finalType: selectedType });

  // 📌 Agregamos este console.log para verificar la información almacenada
  console.log(`✅ Pokémon ${pokemon.name} (${pokemon.id}) confirmado con tipo: ${selectedType}`);

  res.json({
    message: "El tipo ha sido seleccionado correctamente",
    pokemon: selectedPokemons.get(pokemonId) // Devolvemos el Pokémon guardado en el Map
  });
};
