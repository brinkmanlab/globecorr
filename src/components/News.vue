<template>
  <v-item-group class="News">
    <v-card v-for="(item, index) of value" :key="index">
      <v-card-title>{{ item.title }}</v-card-title>
      <v-card-subtitle>{{ (new Date(item.date)).toDateString() }}</v-card-subtitle>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <v-card-text v-html="item.body" />
    </v-card>
  </v-item-group>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class News extends Vue {
        @Prop(Array) value!: {title: string; body: string; date: string}[];
    }
</script>

<style scoped>

</style>
