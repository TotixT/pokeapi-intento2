<template>
    <v-card @click="verDetalles" class="pa-3">
      <v-img :src="pokemon.image" :alt="pokemon.name" height="150px" contain></v-img>
      <v-card-title class="text-center">
        {{ pokemon.name }}
      </v-card-title>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      pokemon: Object, // Recibe el objeto con info del Pokémon
    },
    methods: {
      verDetalles() {
        this.$router.push(`/pokedex/detalles/${this.pokemon.id}`);
      },
    },
  };
  </script>
  