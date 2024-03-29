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
      placeholder="Upload CSV to visualize"
      solo
      accept="csv,tsv"
      hide-details="auto"
      @change="load"
    />
    <ExposomeGlobe
      v-if="value && value.length"
      ref="globe"
      v-model="value"
      :title="title"
      :threshold="globeOptions.threshold"
      :sort="globeOptions.sort"
      :font-size="globeOptions.fontSize"
      :padding="globeOptions.padding"
      :positive-correlation-color="globeOptions.positiveCorrelationColor"
      :negative-correlation-color="globeOptions.negativeCorrelationColor"
      :background-color="globeOptions.backgroundColor"
    />
    <div v-if="error" class="data-error">We are sorry but there was an issue while parsing your data: {{ error }}</div>
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
    import {Data, RGBA} from "@/@types/data";
    import papaparse, {ParseResult, ParseError} from 'papaparse';
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
        private error?: ParseError | string;
        private globeOptions: ExposomeConfig = {
            threshold: 0.0,
            sort: "value",
            fontSize: 15,
            padding: 110,
            positiveCorrelationColor: {r: 79, g: 117, b: 210},
            negativeCorrelationColor: {r: 223, g: 60, b: 60},
            backgroundColor: {r: 255, g: 255, b: 255, a: 0},
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
                    if (!(this.tabOptions.columns.every(c => results.meta.fields.includes(c.field)))) {
                        this.value = [];
                        this.error = `Unexpected columns in data, should only contain [${this.tabOptions.columns.map(c=>c.field).join(", ")}]`;
                        console.debug(this.error);
                    } else {
                        this.value = results.data;
                        this.error = undefined;
                        console.debug('Finished parsing data: %O', this.value);
                    }
                },
                error: (error: ParseError) => {
                    this.value = []
                    this.error = error;
                    console.debug('Failed parsing data: %O', error);
                }
            })
        }

        mounted(): void {
            if (this.$route.query.view) this.load(this.$route.query.view as string);
            for (const key of Object.keys(this.globeOptions)) {
                const query = this.$route.query[key];
                if (typeof query === "string") {
                    const option = this.globeOptions[key];
                    if (typeof option === "number") {
                      this.globeOptions[key] = parseFloat(query);
                    /*} else if (typeof option === "boolean") {
                      const q = query.toLowerCase();
                      this.globeOptions[key] = (q === 'true' || q === 't' || q === '1' || q === 'y')
                    */} else if (query.includes(',')) {
                        const components = query.split(',');
                        const rgba = this.globeOptions[key] as RGBA;
                        rgba.r = parseInt(components[0]);
                        rgba.g = parseInt(components[1]);
                        rgba.b = parseInt(components[2]);
                        if (components.length === 4)
                            rgba.a = parseFloat(components[3]);
                    } else {
                      this.globeOptions[key] = query;
                    }
                }
            }
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
    height: 100vh;
    min-width: 120vh;
  }

  .data-error {
      color: red;
      margin: 2em;
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
