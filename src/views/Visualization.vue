<template>
  <v-card min-height="50vh">
    <v-file-input show-size label="CSV Data" placeholder="Upload data to visualize" solo accept="csv,tsv" @change="load" />
    <ExposomeGlobe v-model="value" :threshold="threshold" :positive-correlation-color="positiveCorrelationColor" :negative-correlation-color="negativeCorrelationColor" />
    <TabulatorComponent v-model="value" :integration="{ updateStrategy: 'UPDATE' }" />
    <v-navigation-drawer
      absolute
      mini-variant
      expand-on-hover
      right
      dark
      :value="true"
      color="primary"
      width="25em"
    >
      <v-list
        dense
        nav
        class="py-0"
      >
        <v-list-item two-line>
          <v-list-item-icon>
            <v-icon>mdi-tune</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Globe Options</v-list-item-title>
            <v-list-item-subtitle>Configuration options for the globe visualisation</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-code-greater-than-or-equal</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-slider
              v-model="threshold"
              class="align-center"
              max="1"
              min="0"
              step="0.01"
              hide-details
              label="Threshold"
              dense
            >
              <template v-slot:append>
                <v-text-field
                  v-model="threshold"
                  dense
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                />
              </template>
            </v-slider>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-pencil-plus</v-icon>
          </v-list-item-icon>

          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-list-item-content v-on="on">
                <v-list-item-title>Positive Correlation Color</v-list-item-title>
                <v-list-item-subtitle>Pick the color for the positive correlation lines</v-list-item-subtitle>
              </v-list-item-content>
            </template>
            <v-color-picker v-model="positiveCorrelationColor" mode="RGBA" />
          </v-menu>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-pencil-minus</v-icon>
          </v-list-item-icon>
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-list-item-content v-on="on">
                <v-list-item-title>Negative Correlation Color</v-list-item-title>
                <v-list-item-subtitle>Pick the color for the negative correlation lines</v-list-item-subtitle>
              </v-list-item-content>
            </template>
            <v-color-picker v-model="negativeCorrelationColor" mode="RGBA" />
          </v-menu>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ExposomeGlobe from "../components/ExposomeGlobe.vue";
    import {Data, RGBA} from "@/@types/data";
    import papaparse, {ParseResult} from 'papaparse';
    import {TabulatorComponent} from "vue-tabulator";
    import "vue-tabulator/dist/scss/bootstrap/tabulator_bootstrap4.scss";

    @Component({
        components: {ExposomeGlobe, TabulatorComponent}
    })
    export default class Visualization extends Vue {
        private threshold = 0.6;
        private value: Data[] = [];
        private positiveCorrelationColor: RGBA = {r: 79, g: 117, b: 210, a: 255};
        private negativeCorrelationColor: RGBA = {r: 223, g: 60, b: 60, a: 255};

        load(file: File): void {
            console.debug('Started parsing %O', file);
            papaparse.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: 'greedy',
                complete: (results: ParseResult)=>{
                  this.value = results.data;
                  console.debug('Finished parsing data: %O', this.value);
                }
            })
        }
    }
</script>

<style scoped>
  .v-list-item__icon {
    margin-top: auto !important;
    margin-bottom: auto !important;
  }

  .v-list-item {
    text-align: left;
  }
</style>
