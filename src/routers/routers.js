import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeVista from '@/components/PokeHome.vue';
import PokemonVista from '@/components/Pokedex/PokemonVista.vue';
import PokemonDetalle from '@/components/Pokedex/PokemonDetalle.vue';
import CombatVista from '@/components/Combat/CombatVista.vue';


// Usar Vue Router en Vue 2
Vue.use(VueRouter);

const routes = [
    { path: '/', redirect: '/inicio' },
    { path: '/inicio', component: HomeVista },
    { path: '/pokedex', component: PokemonVista },
    { path: '/pokedex/detalles/:id', component: PokemonDetalle },
    { path: '/combat', component: CombatVista }
];

const router = new VueRouter({
    mode: 'history',  // Usa 'hash' si tienes problemas con el servidor
    routes
});

export default router;
