<template>
  <v-app>
    <!-- Barra de navegación superior -->
    <v-app-bar app dark color="blue-grey darken-4">
      <v-btn icon @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon> <!-- Botón de menú -->
      </v-btn>
      <v-toolbar-title>Mamayema Puchamon</v-toolbar-title>
    </v-app-bar>

    <!-- Menú lateral -->
    <v-navigation-drawer v-model="drawer" app temporary dark color="blue-grey darken-4">
      <v-list dense>
        <v-list-item @click="goTo('/inicio')">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Inicio</v-list-item-content>
        </v-list-item>
        <v-list-item @click="goTo('/pokedex')">
          <v-list-item-icon>
            <v-icon>mdi-pokeball</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Pokédex</v-list-item-content>
        </v-list-item>
        <v-list-item @click="goTo('/combat')">
          <v-list-item-icon>
            <v-icon>mdi-sword-cross</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Combate</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido de la página -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "NavGeneral",
  data() {
    return {
      drawer: false, // Asegura que inicia cerrado
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer; // Alternar entre abierto y cerrado
    },
    goTo(ruta) {
      if (this.$route.path !== ruta) {
        this.$router.push(ruta);
        this.drawer = false; // Cierra el menú después de hacer clic
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si lo requieres */
</style>
