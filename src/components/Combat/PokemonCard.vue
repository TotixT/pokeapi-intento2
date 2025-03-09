<template>
  <v-card
  class="pa-4 draggable-card"
  elevation="6"
  :class="{ 'in-battle-zone': inBattleZone }"
  :style="{ border: `4px solid ${getColorForType(pokemon.selectedType)}` }"
  :draggable="!isNpc && pokemon.selectedType" 
  v-if="!isNpc || (isNpc && hideNpc)"
  @dragstart="!isNpc ? onDragStart($event) : (event) => event.preventDefault()"
  @dragover.prevent
  @drop="!isNpc && $emit('drop', index)"
>
    <template v-if="isNpc && hideNpc">
      <v-img 
        :src="pokemon.image" 
        alt="Pokémon Oculto"
        class="npc-hidden-img"
        contain height="120" 
      ></v-img>
      <v-card-title class="text-center card-title">
        <span class="pokemon-name">???</span>
      </v-card-title>
    </template>

    <template v-else>
      <v-img :src="pokemon.image" alt="Imagen de Pokémon" contain height="120" width="330"></v-img>
      <v-card-title class="text-center card-title">
        <span class="pokemon-name">{{ pokemon.name }}</span>
      </v-card-title>

      <div v-if="pokemon.selectedType">
        <v-chip :color="getColorForType(pokemon.selectedType)" dark>
          {{ pokemon.selectedType.toUpperCase() }}
        </v-chip>
      </div>

      <div v-else class="type-container">
        <v-btn
          v-for="type in pokemon.availableTypes"
          :key="type"
          class="type-btn"
          :color="getColorForType(type)"
          dark
          @click="$emit('confirmarTipo', { pokemon, type })"
        >
          {{ type.toUpperCase() }}
        </v-btn>
      </div>
    </template>
  </v-card>
</template>

<script>
export default {
  props: {
    pokemon: Object,
    index: Number,
    isNpc: Boolean, // Si es un Pokémon del NPC
    hideNpc: Boolean, // Si las cartas del NPC están ocultas
    inBattleZone: Boolean, // 🔹 Nueva prop para detectar si está en batalla
  },
  methods: {
    onDragStart(event) {
      if (!this.pokemon.selectedType) {
        console.log("⚠️ No puedes arrastrar un Pokémon sin seleccionar su tipo:", this.pokemon.name);
        event.preventDefault(); // Bloquea el arrastre si no tiene tipo
      } else {
        this.$emit('dragStart', this.index);
      }
    },
    getColorForType(type) {
      const typeColors = {
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
      };
      return typeColors[type?.toLowerCase()] || "blue-grey";
    },
  },
};
</script>

<style scoped>
.v-card {
  width: 230px;
  height: 320px;
  text-align: center;
  cursor: grab;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: white;
}

.v-card:active {
  transform: scale(1.05);
}

.v-img {
  width: 330px !important;
  height: 100px !important;
  object-fit: contain;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.type-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-top: 10px;
}

.type-btn {
  min-width: 80px;
  font-size: 12px;
  font-weight: bold;
}

.npc-hidden-img {
  height: 120px;
  object-fit: contain; /* Asegura que la imagen se ajuste sin recortarse */
  border-radius: 12px; /* Mantiene el diseño de la tarjeta */
}

.in-battle-zone {
  transform: scale(0.85); /* 🔹 Hace que la carta se reduzca en el campo de batalla */
  max-width: 180px;
  max-height: 250px;
}
</style>
