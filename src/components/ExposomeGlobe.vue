<template>
  <div :style="{ width: '100%', height: '875px' }" />
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
    import {Chart, ChordDiagramDataItem, ChordNode} from "@amcharts/amcharts4/charts";
    import {Data, RGBA} from "@/@types/data";

    am4core.useTheme(am4themesAnimated);

    @Component
    export default class ExposomeGlobe extends Vue {
        private chart: Chart | null = null;
        @Prop(Number) threshold!: number;
        @Prop(Object) positiveCorrelationColor: RGBA = {r: 79, g: 117, b: 210};
        @Prop(Object) negativeCorrelationColor: RGBA = {r: 223, g: 60, b: 60};
        @Prop(Object) noCorrelationColor: RGBA = {r: 211, g: 211, b: 211};
        @Prop(Array) value!: Data[];

        get filteredData(): Data[] {
            return this.value.filter(datum => Math.abs(datum.coef) >= this.threshold).map(datum=>{
                const intensity = Math.abs(datum.coef);
                return {
                  ...datum,
                  linkColor: am4core.color(datum.coef === 0 ? this.noCorrelationColor : datum.coef > 0 ? this.positiveCorrelationColor : this.negativeCorrelationColor),
                  linkOpacity: intensity * 0.9 + 0.1,
                  label: (Math.round(datum.coef * 1000) / 1000).toString(10),
                  value: intensity,
                }
            });
        }

        @Watch('filteredData')
        updateGlobe(): void {
            if (this.chart)
              this.chart.data = this.filteredData;
        }

        mounted(): void {
            if (this.chart) this.chart.dispose();
            if (this.$el instanceof HTMLElement) {
                // Export
                const chart = am4core.create(this.$el, am4charts.ChordDiagram);
                this.chart = chart;
                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.filePrefix = "exposome-globe";

                // Color settings
                chart.colors.saturation = 0.45;

                chart.data = this.filteredData;
                // Read data from JSON file
                chart.dataFields.fromName = "var1_domain";
                chart.dataFields.toName = "var2_domain";
                chart.dataFields.value = "value";

                // Chart spacing settings
                chart.nodePadding = 0.5;
                chart.minNodeSize = 0.01;
                chart.sortBy = "value";
                chart.fontSize = 15;
                // ?
                chart.fontFamily = "Open Sans";
                //hart.textDecoration


                const nodeTemplate = chart.nodes.template;
                nodeTemplate.propertyFields.fill = "color";

                // eslint-disable-next-line no-inner-declarations
                function hover(isHover: boolean): (this: unknown, event: { type: "over" | "out"; target: ChordNode } & PointerEvent & am4core.MouseTouchEvent & am4core.PointerEvent) => void {
                    return (event): void => {
                        const node = event.target;
                        node.outgoingDataItems.each(function (dataItem) {
                            if (dataItem.toNode) {
                                dataItem.link.isHover = isHover;
                                if (dataItem instanceof ChordDiagramDataItem)
                                    dataItem.toNode.label.isHover = isHover;
                            }
                        });
                        node.incomingDataItems.each(function (dataItem) {
                            if (dataItem.fromNode) {
                                dataItem.link.isHover = isHover;
                                dataItem.fromNode.label.isHover = isHover;
                            }
                        });
                        node.label.isHover = isHover;
                    }
                }

                // Highlight links when hovering over node
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                //@ts-ignore
                nodeTemplate.events.on("over", hover(true));

                // When un-hovering from node, un-hover over links
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                //@ts-ignore
                nodeTemplate.events.on("out", hover(false));

                // Node label formatting
                const label = nodeTemplate.label;
                label.relativeRotation = 90;
                label.fillOpacity = 0.4;
                label.marginTop = 100;
                const labelHS = label.states.create("hover");
                labelHS.properties.fillOpacity = 1;

                // Hover formatting
                nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;

                // Link formatting
                const linkTemplate = chart.links.template;
                linkTemplate.strokeOpacity = 0;
                linkTemplate.fillOpacity = 0.15;
                linkTemplate.tooltipText = "{variable1} → {variable2}: {label}";
                linkTemplate.colorMode = "solid";
                linkTemplate.propertyFields.fill = "linkColor";
                linkTemplate.propertyFields.fillOpacity = "linkOpacity";
                chart.sortBy = "name";
                linkTemplate.clickable = false;

                const hoverState = linkTemplate.states.create("hover");
                hoverState.properties.fillOpacity = 1.0;
                hoverState.properties.strokeOpacity = 1.0;
            } else {
                console.debug('ExposomeGlobe root element not DOM');
            }
        }

        beforeDestroy(): void {
            if (this.chart) {
                this.chart.dispose();
            }
        }
    }
</script>

<style scoped>

</style>
