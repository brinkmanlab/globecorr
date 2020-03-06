<template>
  <v-tabs align-with-title>
    <slot name="before" />
    <v-tab v-for="page in pages" :key="page.name" :to="page.path">
      {{ page.name }}
    </v-tab>
    <slot />
    <slot name="after" />
  </v-tabs>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    // eslint-disable-next-line no-unused-vars
    import {RouteConfig} from "vue-router";

    @Component
    export default class Navigation extends Vue {
        @Prop(Array) readonly routes!: RouteConfig[];

        get pages() {
            return this.routes.filter(route =>
                // eslint-disable-next-line no-prototype-builtins
                (!route.hasOwnProperty('meta') || !route.meta.hasOwnProperty('navbar') || route.meta.navbar === true) // Allow to be hidden using meta tag
            );
        }
    }
</script>

<style scoped>

</style>
