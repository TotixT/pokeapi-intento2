<template>
  <v-container class="fill-height">
    <!-- Mostramos la pantalla de carga si aún no ha terminado de cargar -->
    <CargaDetalle v-if="cargando" />

    <v-row v-else justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4" elevation="10">
          <v-card-title class="text-center text-h5 font-weight-bold">
            {{ pokemon.name.toUpperCase() }}
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text class="text-center">
            <v-img
              :src="pokemon.sprites.front_default"
              alt="Imagen de Pokémon"
              max-width="150"
              class="mx-auto"
            ></v-img>

            <p><strong>Peso:</strong> {{ pokemon.weight / 10 }} kg</p>
            <p><strong>Altura:</strong> {{ pokemon.height / 10 }} m</p>

            <!-- Tipos de Pokémon -->
            <div>
              <strong>Tipo:</strong>
              <v-chip
                v-for="(tipo, index) in pokemon.types"
                :key="index"
                class="ma-1 white--text"
                :color="getTypeColor(tipo.type.name)"
              >
                {{ tipo.type.name.toUpperCase() }}
              </v-chip>
            </div>

            <!-- Debilidades del Pokémon -->
            <div v-if="debilidades.length">
              <strong>Debilidades:</strong>
              <v-chip
                v-for="(tipo, index) in debilidades"
                :key="index"
                class="ma-1 white--text"
                :color="getTypeColor(tipo)"
              >
                {{ tipo.toUpperCase() }}
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn color="blue-grey darken-4" dark @click="$router.push('/pokedex')">
              Volver a la Pokédex
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import CargaDetalle from "@/components/Pokedex/CargaDetalle.vue";

export default {
  name: "PokemonDetalle",
  components: {
    CargaDetalle,
  },
  data() {
    return {
      pokemon: null,
      debilidades: [],
      cargando: true, // Estado de carga activado
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      this.pokemon = response.data;

      // Obtener debilidades del Pokémon
      const tipoUrl = this.pokemon.types[0].type.url;
      const tipoResponse = await axios.get(tipoUrl);
      this.debilidades = tipoResponse.data.damage_relations.double_damage_from.map(
        (tipo) => tipo.name
      );
    } catch (error) {
      console.error("Error al obtener el Pokémon:", error);
    } finally {
      this.cargando = false; // Oculta el loader cuando termina la carga
    }
  },
  methods: {
    getTypeColor(type) {
      const colors = {
        normal: "grey",
        fire: "red darken-2",
        water: "blue darken-2",
        electric: "yellow darken-3",
        grass: "green darken-2",
        ice: "cyan lighten-3",
        fighting: "deep-orange darken-3",
        poison: "purple darken-2",
        ground: "brown lighten-1",
        flying: "blue lighten-3",
        psychic: "pink darken-2",
        bug: "lime darken-2",
        rock: "brown darken-3",
        ghost: "deep-purple darken-3",
        dragon: "indigo darken-4",
        dark: "blue-grey darken-3",
        steel: "blue-grey lighten-2",
        fairy: "pink lighten-3",
      };
      return colors[type] || "grey darken-2";
    },
  },
};
</script>
