<template>
  <v-app id="app">
    <v-app-bar absolute app>
      <v-toolbar-title>GlobeCorr</v-toolbar-title>
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

<style>
</style>
