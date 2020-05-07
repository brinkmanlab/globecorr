<template>
  <div class="exposome-globe" />
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
    import {Chart, ChordNode} from "@amcharts/amcharts4/charts";
    import {Data, RGBA} from "@/@types/data";

    am4core.useTheme(am4themesAnimated);

    @Component
    export default class ExposomeGlobe extends Vue {
        private chart: Chart | null = null;
        @Prop(String) readonly title!: string;
        @Prop(Number) threshold!: number;
        @Prop({default: ()=>({r: 79, g: 117, b: 210})}) readonly positiveCorrelationColor?: RGBA;
        @Prop({default: ()=>({r: 223, g: 60, b: 60})}) readonly negativeCorrelationColor?: RGBA;
        @Prop({default: ()=>({r: 211, g: 211, b: 211})}) readonly noCorrelationColor?: RGBA;
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

        export<Key extends keyof am4core.ExportOptions>(type: Key, options?: am4core.IExportOptions[Key]): void {
            if (this.chart) {
                this.chart.exporting.export(type, options);
            }
        }

        @Watch('filteredData')
        updateGlobe(): void {
            if (this.chart)
              this.chart.data = this.filteredData;
        }

        @Watch('title')
        updatePrefix(): void {
            if (this.chart)
              this.chart.exporting.filePrefix = this.title;
        }

        mounted(): void {
            if (this.chart) this.chart.dispose();
            if (this.$el instanceof HTMLElement) {
                // Export
                const chart = am4core.create(this.$el, am4charts.ChordDiagram);
                this.chart = chart;

                //chart.exporting.menu = new am4core.ExportMenu();
                const PADDING = 60;
                const FONTSIZE = 7;
                const LEGENDSIZE = FONTSIZE;

                // Color settings
                chart.colors.saturation = 0.45;
                chart.paddingTop = PADDING;

                chart.data = this.filteredData;
                chart.dataFields.fromName = "var1_domain";
                chart.dataFields.toName = "var2_domain";
                chart.dataFields.value = "value";

                // Chart spacing settings
                chart.nodePadding = 0.5;
                chart.minNodeSize = 0.01;
                chart.sortBy = "value";
                chart.fontSize = FONTSIZE;
                chart.height = am4core.percent(80);
                chart.fontFamily = "Open Sans";
                const nodeTemplate = chart.nodes.template;
                nodeTemplate.propertyFields.fill = "color";

                // eslint-disable-next-line no-inner-declarations
                function hover(isHover: boolean): (this: unknown, event: { type: "over" | "out"; target: ChordNode } & PointerEvent & am4core.MouseTouchEvent & am4core.PointerEvent) => void {
                    return (event): void => {
                        const node = event.target;
                        node.outgoingDataItems.each(function (dataItem) {
                            if (dataItem.toNode) {
                                dataItem.link.isHover = isHover;
                            }
                        });
                        node.incomingDataItems.each(function (dataItem) {
                            if (dataItem.fromNode) {
                                dataItem.link.isHover = isHover;
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
                label.truncate = true;
                label.maxWidth = 80;
                const labelHS = label.states.create("hover");
                labelHS.properties.fillOpacity = 1;

                // Hover formatting
                nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;

                // Link formatting
                const linkTemplate = chart.links.template;
                linkTemplate.strokeOpacity = 0;
                linkTemplate.fillOpacity = 0.15;
                linkTemplate.tooltipText = "{variable1} ↔ {variable2}: {label}";
                linkTemplate.colorMode = "solid";
                linkTemplate.propertyFields.fill = "linkColor";
                linkTemplate.propertyFields.fillOpacity = "linkOpacity";
                linkTemplate.clickable = false;
                linkTemplate.zIndex = 0;

                const hoverState = linkTemplate.states.create("hover");
                hoverState.properties.fillOpacity = 1.0;
                hoverState.properties.strokeOpacity = 1.0;
                hoverState.properties.zIndex = 1000;

                // Legend
                const legend = chart.chartContainer.createChild(am4core.Container);
                legend.x = am4core.percent(75);
                legend.y = am4core.percent(40);
                legend.padding(10, 10, 10, 10);
                legend.layout = "vertical";

                const positiveLegendItem = legend.createChild(am4core.Container);
                positiveLegendItem.layout = "horizontal";
                positiveLegendItem.padding(chart.fontSize,chart.fontSize,chart.fontSize,chart.fontSize);

                const positiveLegendIcon = positiveLegendItem.createChild(am4core.RoundedRectangle);
                positiveLegendIcon.width = LEGENDSIZE;
                positiveLegendIcon.height = LEGENDSIZE;
                positiveLegendIcon.fill = am4core.color(this.positiveCorrelationColor);

                const positiveLegendLabel = positiveLegendItem.createChild(am4core.Label);
                positiveLegendLabel.text = "Positive";
                positiveLegendLabel.valign = "middle";
                positiveLegendLabel.marginLeft = chart.fontSize;

                const negativeLegendItem = legend.createChild(am4core.Container);
                negativeLegendItem.layout = "horizontal";
                negativeLegendItem.padding(chart.fontSize,chart.fontSize,chart.fontSize,chart.fontSize);

                const negativeLegendIcon = negativeLegendItem.createChild(am4core.RoundedRectangle);
                negativeLegendIcon.width = LEGENDSIZE;
                negativeLegendIcon.height = LEGENDSIZE;
                negativeLegendIcon.fill = am4core.color(this.negativeCorrelationColor);

                const negativeLegendLabel = negativeLegendItem.createChild(am4core.Label);
                negativeLegendLabel.text = "Negative";
                negativeLegendLabel.valign = "middle";
                negativeLegendLabel.marginLeft = chart.fontSize;
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
