<template>
    <v-container class="d-flex justify-center align-center" style="height: 200px;">
      <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
      <span class="ml-3">Cargando detalles...</span>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "CargaDetalle",
  };
  </script>
  
  <style scoped>
  span {
    font-size: 18px;
    font-weight: bold;
  }
  </style>
  