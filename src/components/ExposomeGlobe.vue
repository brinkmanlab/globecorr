<template>
  <div class="exposome-globe" />
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
    import {ChordNode} from "@amcharts/amcharts4/charts";
    import {Data, RGBA} from "@/@types/data";

    am4core.useTheme(am4themesAnimated);

    @Component
    export default class ExposomeGlobe extends Vue {
        private chart: am4charts.ChordDiagram | null = null;
        private posLegendIcon: am4core.RoundedRectangle | null = null;
        private negLegendIcon: am4core.RoundedRectangle | null = null;
        @Prop(String) readonly title!: string;
        @Prop(Number) threshold!: number;
        @Prop({default: "value"}) sort!: string;
        @Prop(Number) fontSize!: number;
        @Prop({default: ()=>({r: 79, g: 117, b: 210})}) readonly positiveCorrelationColor?: RGBA;
        @Prop({default: ()=>({r: 223, g: 60, b: 60})}) readonly negativeCorrelationColor?: RGBA;
        @Prop({default: ()=>({r: 211, g: 211, b: 211})}) readonly noCorrelationColor?: RGBA;
        @Prop(Array) value!: Data[];

        get filteredData(): Data[] {
            const data = this.value.filter(datum => Math.abs(datum.coef) >= this.threshold).map(datum=>{
                const intensity = Math.abs(datum.coef);
                const color = datum.coef === 0 ? this.noCorrelationColor : datum.coef > 0 ? this.positiveCorrelationColor : this.negativeCorrelationColor;
                let scaledColor: RGBA | null = null;
                if (datum.coef !== 0 && color) {
                  // eslint-disable-next-line no-var
                   scaledColor = {
                      r: Math.round(color.r + (255 - color.r) * (0.75 - intensity)),
                      g: Math.round(color.g + (255 - color.g) * (0.75 - intensity)),
                      b: Math.round(color.b + (255 - color.b) * (0.75 - intensity)),
                      a: color.a === undefined ? 1 : color.a
                  }
                }
                return {
                  ...datum,
                  linkColor: am4core.color(scaledColor || color),
                  label: (Math.round(datum.coef * 1000) / 1000).toString(10),
                  value: intensity,
                }
            });
            switch (this.sort) {
              case "value":
                data.sort((a: Data,b: Data)=>a.value - b.value);
                break;
              default:
                break;
            }
            return data;
        }

        export<Key extends keyof am4core.IExportOptions>(type: Key, options?: am4core.IExportOptions[Key]): void {
            if (this.chart) {
                this.chart.exporting.export(type, options);
            }
        }

        @Watch('filteredData')
        updateGlobe(): void {
            if (this.chart)
              this.chart.data = this.filteredData;
        }

        @Watch('positiveCorrelationColor')
        updatePositiveLegend(): void {
            if (this.posLegendIcon)
                this.posLegendIcon.fill = am4core.color(this.positiveCorrelationColor);
        }

        @Watch('negativeCorrelationColor')
        updateNegativeLegend(): void {
            if (this.negLegendIcon)
                this.negLegendIcon.fill = am4core.color(this.negativeCorrelationColor);
        }

        @Watch('title')
        updatePrefix(): void {
            if (this.chart)
              this.chart.exporting.filePrefix = this.title;
        }

        @Watch('fontSize')
        updateFontSize(): void {
            if (this.chart && this.posLegendIcon && this.negLegendIcon) {
                this.chart.fontSize = this.fontSize;
                this.chart.minNodeSize = 0.01 * this.fontSize / 5;
                this.posLegendIcon.width = this.posLegendIcon.height = this.fontSize;
                this.negLegendIcon.width = this.negLegendIcon.height = this.fontSize;
            }
        }

        mounted(): void {
            if (this.chart) this.chart.dispose();
            if (this.$el instanceof HTMLElement) {
                // Export
                const chart = am4core.create(this.$el, am4charts.ChordDiagram);
                //chart.exporting.menu = new am4core.ExportMenu();

                const LABELMAXWIDTH = 110;
                const PADDING = 0;

                this.chart = chart;

                // Color settings
                chart.colors.saturation = 0.45;
                chart.paddingTop = PADDING;
                chart.valign = "middle";

                chart.data = this.filteredData;
                chart.dataFields.fromName = "var1_domain";
                chart.dataFields.toName = "var2_domain";
                chart.dataFields.value = "value";

                // Chart spacing settings
                chart.nodePadding = 0.5;
                chart.sortBy = "none";
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
                label.maxWidth = LABELMAXWIDTH;
                const labelHS = label.states.create("hover");
                labelHS.properties.fillOpacity = 1;

                // Hover formatting
                nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;

                // Link formatting
                const linkTemplate = chart.links.template;
                linkTemplate.strokeOpacity = 0;
                linkTemplate.fillOpacity = 0.5;
                linkTemplate.tooltipText = "{variable1} ↔ {variable2}: {label}";
                linkTemplate.colorMode = "solid";
                linkTemplate.propertyFields.fill = "linkColor";
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
                this.posLegendIcon = positiveLegendIcon;
                positiveLegendIcon.fill = am4core.color(this.positiveCorrelationColor);

                const positiveLegendLabel = positiveLegendItem.createChild(am4core.Label);
                positiveLegendLabel.text = "Positive";
                positiveLegendLabel.valign = "middle";
                positiveLegendLabel.marginLeft = chart.fontSize;

                const negativeLegendItem = legend.createChild(am4core.Container);
                negativeLegendItem.layout = "horizontal";
                negativeLegendItem.padding(chart.fontSize,chart.fontSize,chart.fontSize,chart.fontSize);

                const negativeLegendIcon = negativeLegendItem.createChild(am4core.RoundedRectangle);
                this.negLegendIcon = negativeLegendIcon;
                negativeLegendIcon.fill = am4core.color(this.negativeCorrelationColor);

                const negativeLegendLabel = negativeLegendItem.createChild(am4core.Label);
                negativeLegendLabel.text = "Negative";
                negativeLegendLabel.valign = "middle";
                negativeLegendLabel.marginLeft = chart.fontSize;

                this.updateFontSize();
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
