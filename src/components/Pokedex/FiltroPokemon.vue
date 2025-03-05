<template>
    <v-container>
      <v-text-field
        v-model="name"
        label="Buscar Pokémon"
        outlined
        dense
        @input="emitFiltrado"
      ></v-text-field>
  
      <v-select
        v-model="type"
        :items="tipos"
        label="Filtrar por tipo"
        outlined
        dense
        clearable
        @change="emitFiltrado"
      ></v-select>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: "",
        type: "",
        tipos: [
          "normal", "fire", "water", "electric", "grass", "ice", "fighting",
          "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
          "dragon", "dark", "steel", "fairy"
        ],
      };
    },
    methods: {
      emitFiltrado() {
        this.$emit("filtrarPokemons", { name: this.name, type: this.type });
      },
    },
  };
  </script>
  