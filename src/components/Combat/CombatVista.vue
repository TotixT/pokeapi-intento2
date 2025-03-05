<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    <v-btn color="red darken-2" dark x-large @click="generarPokemons" class="mb-5">
      Ready?
    </v-btn>

    <div class="cards-wrapper">
      <v-row class="mt-2 justify-center" align="center">
        <v-col
          v-for="(pokemon, index) in pokemons"
          :key="pokemon.id || index"
          cols="auto"
          md="2"
          class="d-flex justify-center"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @drop="drop(index)"
        >
          <v-card
            class="pa-4 draggable-card"
            elevation="6"
            :style="{
              border: `4px solid ${getColorForType(pokemon.selectedType)}`,
            }"
          >
            <v-img :src="pokemon.image" alt="Imagen de Pokémon" contain height="120"></v-img>
            <v-card-title class="text-center card-title">
              <span class="pokemon-name">{{ pokemon.name.toUpperCase() }}</span>
            </v-card-title>

            <div v-if="pokemon.selectedType">
              <v-chip :color="getColorForType(pokemon.selectedType)" dark>
                {{ pokemon.selectedType.toUpperCase() }}
              </v-chip>
            </div>

            <div v-else class="d-flex flex-wrap justify-center">
              <v-btn
                v-for="type in pokemon.availableTypes"
                :key="type"
                class="mx-2 mb-2"
                :color="getColorForType(type)"
                dark
                @click="confirmarTipo(pokemon, type)"
              >
                {{ type.toUpperCase() }}
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pokemons: [],
      draggedIndex: null,
      typeColors: {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D02C",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD",
      },
    };
  },
  methods: {
    async generarPokemons() {
      this.pokemons = [];

      for (let i = 0; i < 5; i++) {
        const response = await axios.get("http://localhost:8081/pokemon/pokemonRandom");

        const formattedName = response.data.name.split('-')[0];

        // Obtener los tipos disponibles del Pokémon desde el backend
        const typesResponse = await axios.get(`http://localhost:8081/pokemon/selectType/${response.data.id}`);
        const availableTypes = typesResponse.data.pokemon.availableTypes;

        const newPokemon = {
          ...response.data,
          name: formattedName.toUpperCase(),
          selectedType: null,
          availableTypes, // Cargar tipos desde backend
        };

        // Si solo tiene un tipo, lo confirmamos automáticamente
        if (availableTypes.length === 1) {
          await this.confirmarTipo(newPokemon, availableTypes[0]);
        }

        this.pokemons.push(newPokemon);
      }
    }
    ,
    dragStart(index) {
      this.draggedIndex = index;
    },

    drop(index) {
      if (this.draggedIndex === null || this.draggedIndex === index) return;

      const movedItem = this.pokemons[this.draggedIndex];
      this.pokemons.splice(this.draggedIndex, 1);
      this.pokemons.splice(index, 0, movedItem);

      this.draggedIndex = null;
    },

    async confirmarTipo(pokemon, selectedType) {
      try {
        const response = await axios.post("http://localhost:8081/pokemon/confirmTypeSelection", {
          pokemonId: pokemon.id,
          selectedType,
        });

        // Actualizar el Pokémon con el tipo seleccionado y ocultar los otros botones
        pokemon.selectedType = response.data.pokemon.finalType;
        pokemon.availableTypes = [pokemon.selectedType]; // Se queda solo con el tipo seleccionado
      } catch (error) {
        console.error("Error confirmando el tipo:", error);
      }
    },

    getColorForType(type) {
      return this.typeColors[type?.toLowerCase()] || "blue-grey";
    },
  },
};
</script>

<style scoped>
.v-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.cards-wrapper {
  display: flex;
  justify-content: center;
  gap: 64px;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 16px;
}

.v-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 64px;
  width: 100%;
}

.v-col {
  display: flex;
  justify-content: center;
  width: auto;
}

.v-card {
  width: 230px;
  height: 290px;
  text-align: center;
  cursor: grab;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 12px;
}

.v-card:active {
  transform: scale(1.05);
}

.v-img {
  max-width: 120px;
  height: auto;
}

.card-title {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.v-chip {
  margin-top: 8px;
  font-weight: bold;
}
</style>
