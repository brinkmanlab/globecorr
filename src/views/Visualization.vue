<template>
  <div>
    <Instructions />
    <v-card min-height="70vh">
      <v-file-input show-size label="CSV Data" placeholder="Upload data to visualize" solo accept="csv,tsv" @change="load" />
      <ExposomeGlobe ref="globe" v-model="value" :title="title" :threshold="globeOptions.threshold" :positive-correlation-color="globeOptions.positiveCorrelationColor" :negative-correlation-color="globeOptions.negativeCorrelationColor" />
      <!--TabulatorComponent v-model="value" :options="tabOptions" /-->
      <ExposomeGlobeDrawer v-model="globeOptions" @export="$refs.globe.export" />
    </v-card>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ExposomeGlobe from "../components/ExposomeGlobe.vue";
    import {Data} from "@/@types/data";
    import papaparse, {ParseResult} from 'papaparse';
    import ExposomeGlobeDrawer from "@/components/ExposomeGlobeDrawer.vue";
    import { Value as ExposomeConfig } from "@/components/ExposomeGlobeDrawer";
    //import {TabulatorComponent} from "vue-tabulator";

    import Instructions from '#/globe.md';

    const defaultTabOpts = {
        sorter: 'string',
        width: 200,
        editor: true,
    };

    @Component({
        components: {ExposomeGlobeDrawer, ExposomeGlobe, /*TabulatorComponent, */ Instructions}
    })
    export default class Visualization extends Vue {
        private title = 'exposome-globe';
        private value: Data[] = [];
        private globeOptions: ExposomeConfig = {
            threshold: 0.4,
            positiveCorrelationColor: {r: 79, g: 117, b: 210},
            negativeCorrelationColor: {r: 223, g: 60, b: 60},
        };
        private tabOptions = {
            pagination: 'local',
            paginationSize: 10,
            columns: [
                {
                    title: 'variable1',
                    field: 'variable1',
                    ...defaultTabOpts,
                },
                {
                    title: 'var1_domain',
                    field: 'var1_domain',
                    ...defaultTabOpts,
                },
                {
                    title: 'variable2',
                    field: 'variable2',
                    ...defaultTabOpts,
                },
                {
                    title: 'var2_domain',
                    field: 'var2_domain',
                    ...defaultTabOpts,
                },
                {
                    title: 'coef',
                    field: 'coef',
                    ...defaultTabOpts,
                    sorter: 'number',
                },
            ],
        };

        load(file: File | string): void {
            console.debug('Started parsing %O', file);
            this.title = ((typeof file === 'string') ? file : file.name).split('.').slice(0, -1).join('.');
            papaparse.parse(file, {
                download: typeof file === 'string',
                header: true,
                dynamicTyping: true,
                skipEmptyLines: 'greedy',
                complete: (results: ParseResult) => {
                    this.value = results.data;
                    console.debug('Finished parsing data: %O', this.value);
                }
            })
        }

        mounted(): void {
            if (this.$route.query.view) this.load(this.$route.query.view as string);
        }
    }
</script>

<style scoped>
  .v-card {
    padding-right: 60px;
  }

  .exposome-globe {
    height: 70vh;
    width: 100%;
  }

  .v-list-item__icon {
    margin-top: auto !important;
    margin-bottom: auto !important;
  }

  .v-list-item {
    text-align: left;
  }
</style>

<style lang="scss">
  @import "~vue-tabulator/dist/scss/bootstrap/tabulator_bootstrap4.scss";
</style>
