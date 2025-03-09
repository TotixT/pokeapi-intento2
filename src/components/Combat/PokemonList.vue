<template>
  <v-row class="mt-2 justify-center" align="center">
    <v-col
      v-for="(pokemon, index) in pokemons"
      :key="computedKey(pokemon, index)"
      cols="auto"
      md="2"
      class="d-flex justify-center"
      style="min-width: 230px; min-height: 320px;"
      draggable="true"
      @dragstart="dragStart(index, isNPC)"
      @dragover.prevent
      @drop="drop(index)"
    >
      <PokemonCard
        :pokemon="pokemon"
        :index="index"
        :isNPC="isNPC"
        @dragStart="$emit('dragStart', index)"
        @drop="(event) => $emit('drop', event, index)"
        @confirmarTipo="(data) => $emit('confirmarTipo', data.pokemon, data.type)"
      />
    </v-col>
  </v-row>
</template>

<script>
import PokemonCard from "@/components/Combat/PokemonCard.vue"; // Asegúrate de la ruta correcta

export default {
  components: {
    PokemonCard,
  },
  props: {
    pokemons: Array,
    isNPC: Boolean,
  },
  data() {
    return {
      generatedKeys: [],
      draggedIndex: null, // Índice del Pokémon arrastrado
    };
  },
  methods: {
    computedKey(pokemon, index) {
      const safeId = pokemon.id ?? `temp-${index}`;
      const key = `${safeId}-${this.isNPC ? 'npc' : 'player'}-${index}`;

      this.generatedKeys[index] = key; // Guardamos la clave en el array

      return key;
    },
    dragStart(index) {
      this.draggedIndex = index;
    },
    drop(targetIndex) {
      if (this.isNPC || this.draggedIndex === null || this.draggedIndex === targetIndex) return;

      // Intercambiar Pokémon dentro de la lista
      const temp = this.pokemons[this.draggedIndex];
      this.$set(this.pokemons, this.draggedIndex, this.pokemons[targetIndex]);
      this.$set(this.pokemons, targetIndex, temp);

      this.draggedIndex = null;
    },
  },
};
</script>

<style scoped>
.pokemon-card {
  cursor: grab;
}
</style>
