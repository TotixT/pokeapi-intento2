<template>
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <h1>Pokédex</h1>
        </v-col>
      </v-row>

      <!-- Componente de filtros -->
      <FiltroPokemon @filtrarPokemons="filtrarPokemons" />
  
      <!-- Mostrar el componente de carga mientras se obtienen los datos -->
      <CargaPokedex v-if="cargando" />

      <!-- Lista de Pokémon -->
      <v-row>
        <v-col
          v-for="pokemon in pokemons"
          :key="pokemon.id"
          cols="12" sm="6" md="4" lg="3"
        >

          <CardPokemon :pokemon="pokemon" />
        </v-col>
      </v-row>
  
      <!-- Paginación -->
      <v-row justify="center">
        <v-pagination
          v-model="paginaActual"
          :length="totalPaginas"
          @input="cambiarPagina"
        ></v-pagination>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  import CardPokemon from "@/components/Pokedex/CardPokemon.vue";
  import FiltroPokemon from "@/components/Pokedex/FiltroPokemon.vue";
  import CargaPokedex from "@/components/Pokedex/CargaPokedex.vue";

  
  export default {
    components: {
      CardPokemon,
      FiltroPokemon,
      CargaPokedex
    },
    data() {
  return {
    todosLosPokemons: [], // Lista completa de Pokémon
    pokemonsFiltrados: [], // Lista filtrada
    pokemons: [], // Lista paginada
    paginaActual: 1,
    limite: 20,
    totalPaginas: 1,
    filtro: {
      name: "",
      type: "",
    },
    cargando: true, // Estado de carga
  };
},
    mounted() {
      this.obtenerPokemons();
    },
    methods: {
      async obtenerPokemons() {
  try {
    this.cargando = true; // Iniciar carga

    if (this.todosLosPokemons.length > 0) {
      this.aplicarPaginacion();
      this.cargando = false; // Terminar carga
      return;
    }

    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000");
    const resultados = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const res = await axios.get(pokemon.url);
        return {
          id: res.data.id,
          name: res.data.name,
          image: res.data.sprites.front_default,
          types: res.data.types.map((t) => t.type.name),
        };
      })
    );

    this.todosLosPokemons = resultados;
    this.pokemonsFiltrados = [...this.todosLosPokemons];
    this.aplicarPaginacion();
  } catch (error) {
    console.error("Error al obtener los Pokémon:", error);
  } finally {
    this.cargando = false; // Finalizar carga
  }
},
      cambiarPagina() {
        this.obtenerPokemons();
      },
      filtrarPokemons(filtro) {
  this.filtro = filtro;
  this.paginaActual = 1; // Reiniciar a la primera página al filtrar

  let filtrados = [...this.todosLosPokemons]; // Copia la lista completa

  if (this.filtro.name) {
    const nombreBuscado = this.filtro.name.toLowerCase().trim();

    // Buscar si hay un Pokémon con coincidencia exacta
    const pokemonExacto = filtrados.find(
      (pokemon) => pokemon.name.toLowerCase() === nombreBuscado
    );

    if (pokemonExacto) {
      filtrados = [pokemonExacto]; // Mostrar solo ese si es una coincidencia exacta
    } else {
      filtrados = filtrados.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(nombreBuscado)
      );
    }
  }

  if (this.filtro.type) {
    filtrados = filtrados.filter((pokemon) =>
      pokemon.types.includes(this.filtro.type)
    );
  }

  this.pokemonsFiltrados = filtrados; // No modificar `todosLosPokemons`
  this.aplicarPaginacion();
},

      aplicarPaginacion() {
        const inicio = (this.paginaActual - 1) * this.limite;
        const fin = inicio + this.limite;
        this.pokemons = this.pokemonsFiltrados.slice(inicio, fin);
        this.totalPaginas = Math.ceil(this.pokemonsFiltrados.length / this.limite);
      },
    },
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 2rem;
    font-weight: bold;
  }
  </style>
