<template>
    <div class="static_content" v-html="content" :class="slug" v-once></div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class App extends Vue {
        @Prop(String) readonly content!: string;
        @Prop(String) readonly slug?: string;
    }
</script>
