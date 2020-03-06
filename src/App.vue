<template>
  <v-app id="app">
    <v-app-bar absolute app>
      <v-toolbar-title>GlobeCorr</v-toolbar-title>
      <v-spacer></v-spacer>
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
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
