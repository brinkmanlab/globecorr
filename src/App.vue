<template>
  <v-app id="app">
    <v-app-bar absolute app dense>
      <v-toolbar-title><router-link to="/"><img alt="" src="/logo/globecorr_logo_no_text.svg">GlobeCorr</router-link></v-toolbar-title>
      <v-spacer />
      <Navigation :routes="routes" />
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view :class="$route.meta && $route.meta.slug || ''" />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Navigation from "@/components/Navigation.vue";

    import routes from '@/router/main';

    @Component({
        components: {Navigation}
    })
    export default class App extends Vue {
        private routes = routes;
    }
</script>

<style scoped>
  .v-toolbar__title {
    height: inherit;
  }

  .v-toolbar__title {
    min-width: calc(10ch + 1.5em);
  }

  .v-toolbar__title img {
    height: inherit;
    vertical-align: middle;
    object-fit: contain;
    padding: 5px;
  }
</style>

<style lang="scss">
  @use '@/assets/main.scss';
</style>
