<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    
    <!-- Cartas del NPC (Ocultas) -->
    <div class="cards-wrapper npc-cards">
      <PokemonList :pokemons="pokemonsNPC" :isNPC="true" />
    </div>

    <v-btn color="red darken-2" dark x-large @click="generarPokemons" class="mb-5 mt-5">
      Ready?
    </v-btn>

        <div v-if="battleReady" class="battle-area d-flex align-center justify-center mt-5 mb-5">
      <!-- Espacio para el Pokémon del jugador -->
      <div class="player-section d-flex flex-column align-center">
        <strong>Jugador</strong>
        <div class="player-slot" @drop="dropInPlayerSlot" @dragover.prevent @click="removePlayerPokemon">
          <PokemonCard v-if="playerPokemon" :pokemon="playerPokemon" :isNpc="false" :inBattleZone="true" />
        </div>
      </div>

      <!-- Botón de batalla, solo aparece si ambos Pokémon están colocados -->
      <v-btn v-if="playerPokemon && npcPokemon" color="blue darken-2" dark x-large @click="startBattle">
        BATTLE!
      </v-btn>
      
      <!-- Espacio para el Pokémon del NPC -->
      <div class="npc-section d-flex flex-column align-center">
        <strong>NPC</strong>
        <div class="npc-slot">
          <PokemonCard v-if="npcPokemon" :pokemon="npcPokemon" :isNpc="true" :inBattleZone="true" />
        </div>
      </div>
    </div>


    <div class="cards-wrapper">
      <PokemonList :pokemons="pokemons" @dragStart="dragStart" @drop="dropInList" @dragOver="dragOver" @confirmarTipo="confirmarTipo" />
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import PokemonList from "./PokemonList.vue";
import PokemonCard from "@/components/Combat/PokemonCard.vue";

export default {
  components: { PokemonList, PokemonCard },
  data() {
    return {
      pokemons: [],
      pokemonsNPC: [],
      playerPokemon: null,
      npcPokemon: null,
      draggedIndex: null,
      battleReady: false,
    };
  },
  methods: {
    async generarPokemons() {
  console.log("Iniciando carga de pokemons...");
  this.battleReady = true;

  // 🔹 Si hay un Pokémon en el espacio en blanco, lo regresamos a la lista
  if (this.playerPokemon) {
    this.pokemons.push(this.playerPokemon);
    this.playerPokemon = null; // Limpiar el espacio en blanco
  }

  // 🔹 Limpiar el Pokémon del NPC también
  this.npcPokemon = null;

  // 🔹 Resetear las listas antes de generar nuevos Pokémon
  this.pokemons = [];
  this.pokemonsNPC = [];

  for (let i = 0; i < 5; i++) {
    try {
      // 🔹 Obtener Pokémon para el jugador
      const responseJugador = await axios.get("http://localhost:8081/pokemon/pokemonRandom");
      const typesResponseJugador = await axios.get(`http://localhost:8081/pokemon/selectType/${responseJugador.data.id}`);

      this.pokemons.push({
        ...responseJugador.data,
        name: responseJugador.data.name.split("-")[0].toUpperCase(),
        availableTypes: typesResponseJugador.data.pokemon.availableTypes || [],
        selectedType: null,
      });

      // 🔹 Si el Pokémon tiene un solo tipo, seleccionarlo automáticamente
      if (this.pokemons[i].availableTypes.length === 1) {
        this.confirmarTipo(this.pokemons[i], this.pokemons[i].availableTypes[0]);
      }

      // 🔹 Obtener Pokémon para el NPC (ocultos)
      const responseNPC = await axios.get("http://localhost:8081/pokemon/pokemonRandom");
      this.pokemonsNPC.push({
        id: responseNPC.data.id,
        name: "???",
         image: responseNPC.data.image,
        //image: "https://tcg.pokemon.com/assets/img/global/tcg-card-back.jpg",
        selectedType: "???",
        availableTypes: [],
      });

    } catch (error) {
      console.error("Error al obtener Pokémon:", error);
    }
  }
}

    ,
    dragStart(index, isNpc = false) {
      if (isNpc) return; // 🔹 Evita que las cartas del NPC sean arrastradas
      this.draggedIndex = index;
    },
    dropInPlayerSlot() {
        if (this.draggedIndex === null) return;

        const pokemon = this.pokemons[this.draggedIndex];

        console.log("Intentando colocar Pokémon en la zona de batalla:", pokemon);

        if (!pokemon.selectedType) {
          console.log("❌ Error: Pokémon sin tipo confirmado:", pokemon);
          alert("⚠️ Debes confirmar el tipo del Pokémon antes de enviarlo a la batalla.");
          return;
        }

        console.log("✅ Pokémon con tipo confirmado, moviéndolo a la batalla.");

        if (this.playerPokemon) {
          this.pokemons.push(this.playerPokemon);
        }

        this.playerPokemon = pokemon;
        this.pokemons.splice(this.draggedIndex, 1);
        this.draggedIndex = null;

        if (!this.npcPokemon) {
          this.assignNpcPokemon();
        }
      },
    removePlayerPokemon() {
      if (this.playerPokemon) {
        this.pokemons.push(this.playerPokemon);
        this.playerPokemon = null;
      }
    },
    dropInList(event, targetIndex, isNpc = false) {
      if (isNpc) return; // 🔹 Evita que las cartas del NPC puedan ser modificadas

      event.preventDefault();
      if (this.draggedIndex === null || targetIndex === this.draggedIndex) return;

      // Intercambiar Pokémon en la lista
      const temp = this.pokemons[this.draggedIndex];
      this.$set(this.pokemons, this.draggedIndex, this.pokemons[targetIndex]);
      this.$set(this.pokemons, targetIndex, temp);

      this.draggedIndex = null;
    },
    dragOver(event) {
      event.preventDefault();
    },
    assignNpcPokemon() {
      if (this.pokemonsNPC.length > 0) {
        this.npcPokemon = this.pokemonsNPC[Math.floor(Math.random() * this.pokemonsNPC.length)];
      }
    },
    startBattle() {
      console.log("¡La batalla ha comenzado entre", this.playerPokemon?.name, "y", this.npcPokemon?.name, "!");
    },
    async confirmarTipo(pokemon, selectedType) {
      console.log(`Confirmando tipo: ${selectedType} para ${pokemon.name}`);
      
      try {
        const response = await axios.post("http://localhost:8081/pokemon/confirmTypeSelection", {
          pokemonId: pokemon.id,
          selectedType,
        });

        if (response.data.pokemon.finalType) {
          pokemon.selectedType = response.data.pokemon.finalType;
          pokemon.availableTypes = [pokemon.selectedType];
          console.log(`✅ Tipo confirmado: ${pokemon.selectedType}`);
        } else {
          console.warn(`⚠️ No se recibió un tipo válido para ${pokemon.name}`);
        }
      } catch (error) {
        console.error("Error confirmando el tipo:", error);
      }
    },
  },
};
</script>

<style scoped>
.battle-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.player-slot, .npc-slot {
  width: 150px;
  height: 200px;
  border: 2px dashed gray;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
