<template>
  <v-navigation-drawer
      persistent
      absolute
      hide-overlay
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
              :value="value.threshold"
              @input="val=>input('threshold', val)"
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
                  :value="value.threshold"
                  @input="val=>input('threshold', val)"
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
          <v-color-picker :value="value.positiveCorrelationColor" @input="val=>input('positiveCorrelationColor', val)" mode="RGBA" />
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
          <v-color-picker :value="value.negativeCorrelationColor" @input="val=>input('negativeCorrelationColor', val)" mode="RGBA" />
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
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {RGBA} from "@/@types/data";
    import {Value} from './ExposomeGlobeDrawer'

    @Component({components: {}})
    export default class ExposomeGlobeDrawer extends Vue {
        $refs!: {};
        @Prop(Object) value!: Value;
        private _value?: Value;

        input(key: keyof Value, val: number & RGBA ): void {
            if (!this._value) this._value = this.value;
            this._value[key] = val;
            this.$emit('input', this._value);
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
