<template>
  <v-card
    min-height="70vh"
    @dragstart.native.stop.prevent
    @dragover.native.prevent
    @drop.native.prevent="load($event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0])"
  >
    <v-file-input
      dense
      show-size
      label="CSV Data"
      placeholder="Upload data to visualize"
      solo
      accept="csv,tsv"
      hide-details="auto"
      @change="load"
    />
    <ExposomeGlobe
      v-if="value.length"
      ref="globe"
      v-model="value"
      :title="title"
      :threshold="globeOptions.threshold"
      :positive-correlation-color="globeOptions.positiveCorrelationColor"
      :negative-correlation-color="globeOptions.negativeCorrelationColor"
    />
    <Instructions class="instructions" :class="{'footer': value.length}" />
    <!--TabulatorComponent v-model="value" :options="tabOptions" /-->
    <ExposomeGlobeDrawer v-model="globeOptions" @export="type=>this.$refs.globe.export(type)">
      <template v-if="value.length" v-slot:info>
        <Instructions class="instructions" />
      </template>
    </ExposomeGlobeDrawer>
  </v-card>
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
        components: {ExposomeGlobeDrawer, ExposomeGlobe, /*TabulatorComponent, */ Instructions: Instructions.vue.component}
    })
    export default class Visualization extends Vue {
        $refs!: {
            globe: ExposomeGlobe;
        };
        private title = 'exposome-globe';
        private value: Data[] = [];
        private globeOptions: ExposomeConfig = {
            threshold: 0.0,
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
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
  }

  .v-card > * {
    width: 100%;
  }

  .v-file-input >>> .v-input__control {
    min-height: unset !important;
    max-width: 25ch;
  }

  .v-file-input >>> .v-input__prepend-outer {
    margin-top: 4px !important;
  }

  .exposome-globe {
    height: 80vh;
  }

  .instructions {
    flex-grow: 1;
  }

  .instructions:not(.footer) {
    max-width: 30em;
  }
</style>

<style lang="scss">
  //@import "~vue-tabulator/dist/scss/bootstrap/tabulator_bootstrap4.scss";
  @import '~vuetify/src/components/VList/_variables.scss';

  .exposome-globe-controls .instructions {
    font-size: $list-dense-subheader-font-size;
  }

  .exposome-globe-controls .instructions, .instructions.footer {
    & > * {
      display: none;
    }
  }

  .exposome-globe-controls .instructions > p:nth-child(2) {
    display: unset;
  }

  .instructions.footer > p:nth-child(3), .instructions.footer > p:nth-child(4) {
    display: block;
    margin: 0;
  }

  .instructions.footer {
    margin-top: 1em;
  }
</style>
