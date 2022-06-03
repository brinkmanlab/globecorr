<template>
  <v-navigation-drawer
    ref="drawer"
    persistent
    absolute
    hide-overlay
    :mini-variant="!lockOpen"
    :expand-on-hover="!lockOpen"
    right
    dark
    color="primary"
    width="25em"
    class="exposome-globe-controls"
    @mouseleave.native="$refs['drawer'].isMouseover = false"
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
          <v-icon>mdi-sort-descending</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-select
            :value="internalValue.sort"
            :items="sortOptions"
            label="Sort"
            dense
            hide-details
            @input="val=>input('sort', val)"
            @focus="lockOpen=true"
            @blur="lockOpen=false"
          />
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-code-greater-than-or-equal</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-slider
            :value="internalValue.threshold"
            max="1"
            class="align-center"
            min="0"
            step="0.01"
            dense
            label="Threshold"
            hide-details
            @input="val=>input('threshold', val)"
          >
            <template v-slot:append>
              <v-text-field
                :value="internalValue.threshold"
                single-line
                hide-details
                class="mt-0 pt-0"
                min="0"
                dense
                type="number"
                max="1"
                step="0.01"
                @input="val=>input('threshold', val)"
              />
            </template>
          </v-slider>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-format-size</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-slider
            :value="internalValue.fontSize"
            max="50"
            class="align-center"
            min="4"
            step="1"
            dense
            label="Font Size"
            hide-details
            @input="val=>input('fontSize', val)"
          >
            <template v-slot:append>
              <v-text-field
                :value="internalValue.fontSize"
                single-line
                hide-details
                class="mt-0 pt-0"
                min="4"
                dense
                type="number"
                max="50"
                step="1"
                @input="val=>input('fontSize', val)"
              />
            </template>
          </v-slider>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-arrow-split-vertical</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-slider
              :value="internalValue.padding"
              max="500"
              class="align-center"
              min="40"
              step="10"
              dense
              label="Label Width"
              hide-details
              @input="val=>input('padding', val)"
          >
            <template v-slot:append>
              <v-text-field
                  :value="internalValue.padding"
                  single-line
                  hide-details
                  class="mt-0 pt-0"
                  min="40"
                  dense
                  type="number"
                  max="500"
                  step="1"
                  @input="val=>input('padding', val)"
              />
            </template>
          </v-slider>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon>
            M19.35 11.72L17.22 13.85L15.81 12.43L8.1 20.14L3.5 22L2 20.5L3.86 15.9L11.57 8.19L10.15 6.78L12.28
            4.65L19.35 11.72M16.76 3C17.93 1.83 19.83 1.83 21 3S22.17 6.07 21 7.24L19.08 9.16L14.84 4.92L16.76 3M5.56
            17.03L4.5 19.5L6.97 18.44L14.4 11L13 9.6L5.56 17.03M6 1V4H9V6H6V9H4V6H1V4H4V1H6Z
          </v-icon>
        </v-list-item-icon>

        <v-menu :close-on-content-click="false" absolute>
          <template v-slot:activator="{ on }">
            <v-list-item-content v-on="on">
              <v-list-item-title>Positive Correlation Color</v-list-item-title>
              <v-list-item-subtitle>Pick the color for the positive correlation lines</v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <v-color-picker v-bind="colorPickerOptions" :value="internalValue.positiveCorrelationColor" @input="val=>input('positiveCorrelationColor', val)" />
        </v-menu>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon>
            M19.35 11.72L17.22 13.85L15.81 12.43L8.1 20.14L3.5 22L2 20.5L3.86 15.9L11.57 8.19L10.15 6.78L12.28
            4.65L19.35 11.72M16.76 3C17.93 1.83 19.83 1.83 21 3S22.17 6.07 21 7.24L19.08 9.16L14.84 4.92L16.76 3M5.56
            17.03L4.5 19.5L6.97 18.44L14.4 11L13 9.6L5.56 17.03M9 4V6H1V4H9Z
          </v-icon>
        </v-list-item-icon>
        <v-menu :close-on-content-click="false" absolute>
          <template v-slot:activator="{ on }">
            <v-list-item-content v-on="on">
              <v-list-item-title>Negative Correlation Color</v-list-item-title>
              <v-list-item-subtitle>Pick the color for the negative correlation lines</v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <v-color-picker v-bind="colorPickerOptions" :value="internalValue.negativeCorrelationColor" @input="val=>input('negativeCorrelationColor', val)" />
        </v-menu>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-format-color-fill</v-icon>
        </v-list-item-icon>
        <v-menu :close-on-content-click="false" absolute>
          <template v-slot:activator="{ on }">
            <v-list-item-content v-on="on">
              <v-list-item-title>Background Color</v-list-item-title>
              <v-list-item-subtitle>Pick the background color and opacity <br>(transparent by default)</v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <v-color-picker v-bind="colorPickerOptions" :value="internalValue.backgroundColor" @input="val=>input('backgroundColor', val)" />
        </v-menu>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-file-export</v-icon>
        </v-list-item-icon>
        <v-menu :close-on-content-click="true" nudge-width="4em" absolute>
          <template v-slot:activator="{ on }">
            <v-list-item-content v-on="on">
              <v-list-item-title>Export</v-list-item-title>
              <v-list-item-subtitle>Export the globe as an image format</v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <v-list dense>
            <v-list-item v-for="t of ['png', 'jpg', 'svg', 'pdf']" :key="t" link @click="$emit('export', t)">
              <v-list-item-title>Export as {{ t }}</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="$emit('export', 'print')">
              <v-list-item-title>Send to printer</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon><v-icon>mdi-content-copy</v-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Quick Settings</v-list-item-title>
          <v-text-field
            v-model="optionsString"
            hide-details
            dense
            :error="invalidOptions"
            style="margin-top: 0; font-size: 0.8rem"
            @click="$event.target.select()"
            @blur="resetOptions"
          />
          <v-list-item-subtitle>Copy and Paste this to quickly recover your settings</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="!!$slots['info']">
        <v-list-item-icon><v-icon>mdi-information</v-icon></v-list-item-icon>
        <v-list-item-content>
          <slot name="info" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {RGBA} from "@/@types/data";
    import {Value} from './ExposomeGlobeDrawer'

    @Component({components: {}})
    export default class ExposomeGlobeDrawer extends Vue {
        $refs!: {};
        @Prop(Object) value!: Value;
        private internalValue: Value = this.value;
        private lockOpen = false;
        private invalidOptions = false;
        private optionsString = JSON.stringify(this.value);
        private colorPickerOptions = {
            mode: "rgba",
            "show-swatches": true,
            swatches: [
              ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', ],
              ['#2ca02c', '#98df8a', '#d62728', '#ff9896', ],
              ['#9467bd', '#c5b0d5', '#8c564b', '#c49c94', ],
              ['#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', ],
              ['#bcbd22', '#dbdb8d', '#17becf', '#9edae5', ],
            ],
            "hide-inputs": false,
        };
        private sortOptions = [
            {text: "Order in File", value: "none"},
            {text: "Domain size", value: "value"},
        ];

        input(key: keyof Value, val: number & RGBA ): void {
            this.internalValue[key] = val;
            this.$emit('input', this.internalValue);
            this.resetOptions();
            //this.lockOpen = false;
        }

        resetOptions(): void {
            this.optionsString = JSON.stringify(this.internalValue);
            this.invalidOptions = false;
        }

        @Watch('optionsString')
        parseOptions(options: string): void {
            try {
                this.invalidOptions = false;
                const value = JSON.parse(options);
                if (typeof value === 'object' && Object.keys(this.internalValue).every(v=>v in value)) {
                  Object.assign(this.internalValue, value);
                } else {
                    this.invalidOptions = true;
                }
            } catch (e) {
                this.invalidOptions = true;
            }
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

  .v-list >>> .v-divider {
    margin-bottom: 4px;
  }

  .v-input >>> .v-text-field input {
    min-width: 4ch;
  }

  >>> .v-color-picker {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
