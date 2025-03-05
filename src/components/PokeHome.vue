<template>

    <v-container class="d-flex flex-column justify-center align-center text-center monda">
    <!-- Título principal -->
    <h1 class="titulo">Proyecto PokéAPI</h1>

    <!-- Subtítulo -->
    <h2 class="subtitulo">Hecho por TotixT</h2>

    <!-- Imagen de Pokémon -->
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjTjeNHyqBHdImqGDutRVJ02tBUSDXaZfgtg&s"
      alt="PokeAPI"
      max-width="200px"
      class="mt-5"
    />
    </v-container>

</template>

<style scoped>
.titulo {
  font-size: 36px;
  font-weight: bold;
}

.subtitulo {
  font-size: 20px;
  color: #666;
}

/* Asegura que el contenedor ocupa toda la pantalla */
.monda {
  height: 90vh; /* 100% de la altura de la pantalla */
}

</style>


<script>
export default {
  name: 'HomeVista'
}
</script>
