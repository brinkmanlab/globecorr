<template>
  <v-app id="app">
    <v-app-bar absolute app>
      <v-toolbar-title><img src="/logo/globecorr_logo_no_text.svg">GlobeCorr</v-toolbar-title>
      <v-spacer />
      <template v-slot:extension>
        <Navigation :routes="routes" />
      </template>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view />
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

  .v-toolbar__title img {
    height: inherit;
    vertical-align: middle;
    object-fit: contain;
    padding: 5px;
  }
</style>
