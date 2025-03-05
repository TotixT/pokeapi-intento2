<template>
  <v-app>
    <v-main>
      <NavGeneral />
    </v-main>
  </v-app>
</template>

<script>
import NavGeneral from '@/views/NavGeneral.vue';

export default {
  name: 'App',
  components: { NavGeneral },
};
</script>