<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="static_content" :class="slug" v-html="content" />
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class App extends Vue {
        @Prop(String) readonly content!: string;
        @Prop(String) readonly slug?: string;
    }
</script>
