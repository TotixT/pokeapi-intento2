<template>
    <v-container class="carga-container">
      <v-row justify="center" align="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <p class="mensaje">Cargando datos...</p>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "CargaPokedex",
  };
  </script>
  
  <style scoped>
  .carga-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }
  
  .mensaje {
    font-size: 1.2rem;
    margin-top: 10px;
    color: #555;
  }
  </style>
  