<template>
  <v-container class="Home">
    <v-row>
      <v-col class="floating welcome">
        <HTMLFragment :content="welcome" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="floating examples">
        <h1>Getting Started</h1>
        <HTMLFragment :content="examples" />
      </v-col>
      <v-col class="floating">
        <h1>News and Updates</h1>
        <News :value="news" />
        <router-link to="/news">View more...</router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import HTMLFragment from "@/components/HTMLFragment.vue";
    import News from "@/components/News.vue";

    import news from "@/assets/news.json";
    import welcome from "html-loader!@/assets/welcome.htm"
    import examples from "html-loader!@/assets/examples.htm"

    @Component({
        components: {News, HTMLFragment},
    })
    export default class Home extends Vue {
        private origin = origin;
        private news = news;
        private welcome = welcome;
        private examples = examples;
    }
</script>

<style scoped>
  .News + a {
    display: block;
    border-radius: 0.25rem;
    /*background: #d4dcef;*/
    text-align: center;
    margin-left: -2px;
    margin-right: -2px;
    color: grey;
    text-decoration: none;
    background: rgba(0, 0, 0, 0.03);
  }
</style>
