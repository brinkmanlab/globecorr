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
    am4core.options.autoDispose = true;

    @Component
    export default class ExposomeGlobe extends Vue {
        private chart: am4charts.ChordDiagram | null = null;
        private posLegendIcon: am4core.RoundedRectangle | null = null;
        private negLegendIcon: am4core.RoundedRectangle | null = null;
        private legendLabels: am4core.Label[] | null = null;
        private null_message?: am4core.Container;
        @Prop(String) readonly title!: string;
        @Prop(Number) threshold!: number;
        @Prop({default: "value"}) sort!: "value" | "none" | "name";
        @Prop(Number) fontSize!: number;
        @Prop(Number) padding!: number;
        @Prop({default: ()=>({r: 79, g: 117, b: 210})}) readonly positiveCorrelationColor?: RGBA;
        @Prop({default: ()=>({r: 223, g: 60, b: 60})}) readonly negativeCorrelationColor?: RGBA;
        @Prop({default: ()=>({r: 211, g: 211, b: 211})}) readonly noCorrelationColor?: RGBA;
        @Prop({default: ()=>({r: 255, g: 255, b: 255, a: 0})}) readonly backgroundColor?: RGBA;
        @Prop(Array) value!: Data[];

        get filteredData(): Data[] {
            const domainOrder: string[] = this.value.reduce((acc,cur)=>{for (const c of [cur.var1_domain, cur.var2_domain]) if (!acc.includes(c)) acc.push(c); return acc}, [] as string[]);
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
            const firstDomains: Data[] = [];
            for (let di = 0; di < domainOrder.length; ++di) {
                const domain = domainOrder[di];
                let i = data.findIndex(d=>(d.var1_domain === domain && domainOrder.slice(0, di+2).includes(d.var2_domain)));
                if (i === -1) i = data.findIndex(d=>(d.var2_domain === domain && domainOrder.slice(0, di).includes(d.var1_domain)));
                if (i >= 0) firstDomains.push(...data.splice(i, 1));
            }
            return firstDomains.concat(data);
        }

        export<Key extends keyof am4core.IExportOptions>(type: Key, options?: am4core.IExportOptions[Key]): void {
            if (this.chart) {
                this.chart.exporting.export(type, options);
            }
        }

        @Watch('filteredData')
        updateGlobe(): void {
            if (this.chart) {
                if (this.filteredData.length) {
                    this.null_message?.hide();
                    this.chart.data = this.filteredData;
                } else {
                    this.null_message?.show();
                }
            }
        }

        @Watch('sort')
        updateSort(): void {
            if (this.chart) {
              switch (this.sort) {
                case "value":
                case "none":
                case "name":
                  this.chart.sortBy = this.sort;
                  break;
              }
            }
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

        @Watch('backgroundColor')
        updateBackgroundColor(): void {
            if (this.chart && this.backgroundColor && this.legendLabels) {
                this.chart.background.fill = am4core.color(this.backgroundColor);
                const labelColor = am4core.color(
                    ((this.backgroundColor.r + this.backgroundColor.g + this.backgroundColor.b) < 382 && (this.backgroundColor.a || 0) > 0.5)
                        ? "white" : "black");
                this.chart.nodes.template.label.fill = labelColor;
                this.legendLabels.forEach(l=>l.fill = labelColor);
            }
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

        @Watch('padding')
        updatePadding(): void {
            if (this.chart) {
                this.chart.nodes.template.label.maxWidth = this.padding;
                this.chart.padding(this.padding, this.padding, this.padding, this.padding);
            }
        }

        mounted(): void {
            if (this.chart) this.chart.dispose();
            if (this.$el instanceof HTMLElement) {
                // Export
                const chart = am4core.create(this.$el, am4charts.ChordDiagram);
                //chart.exporting.menu = new am4core.ExportMenu();

                this.chart = chart;

                if (chart.tooltipContainer) {
                    this.null_message = chart.tooltipContainer.createChild(am4core.Container);
                    this.null_message.hide();
                    this.null_message.background.fill = am4core.color("#fff");
                    this.null_message.background.fillOpacity = 0.8;
                    this.null_message.width = am4core.percent(100);
                    this.null_message.height = am4core.percent(100);

                    const indicatorLabel = this.null_message.createChild(am4core.Label);
                    indicatorLabel.text = "No data available that meets threshold criteria.";
                    indicatorLabel.align = "center";
                    indicatorLabel.valign = "middle";
                    indicatorLabel.fontSize = 20;
                }

                // Color settings
                chart.colors.saturation = 0.45;
                chart.valign = "middle";

                chart.data = this.filteredData;
                chart.dataFields.fromName = "var1_domain";
                chart.dataFields.toName = "var2_domain";
                chart.dataFields.value = "value";

                // Chart spacing settings
                chart.nodePadding = 0.5;
                chart.sortBy = "none"; //this.sort;
                chart.fontFamily = "Open Sans";
                chart.percentHeight = 100;
                chart.marginTop = 0;
                const nodeTemplate = chart.nodes.template;
                nodeTemplate.propertyFields.fill = "color";

                // eslint-disable-next-line no-inner-declarations
                function hover(isHover: boolean): (this: unknown, event: { type: "over" | "out"; target: ChordNode } & PointerEvent & am4core.MouseTouchEvent & am4core.PointerEvent) => void {
                    const state = isHover ? "nodeHover" : "default";
                    return (event): void => {
                        const node = event.target;
                        node.outgoingDataItems.each(function (dataItem) {
                            if (dataItem.toNode) {
                                dataItem.link.setState(state);
                            }
                        });
                        node.incomingDataItems.each(function (dataItem) {
                            if (dataItem.fromNode) {
                                dataItem.link.setState(state);
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
                label.wrap = true;
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

                const nodeHoverState = linkTemplate.states.create("nodeHover");
                nodeHoverState.properties.fillOpacity = 1.0;
                nodeHoverState.properties.strokeOpacity = 1.0;
                nodeHoverState.properties.zIndex = 1000;

                // Legend
                const legend = chart.chartContainer.createChild(am4core.Container);
                legend.align = "right";
                legend.valign = "top";
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

                this.legendLabels = [positiveLegendLabel, negativeLegendLabel];

                this.updateFontSize();
                this.updatePadding();
                this.updateBackgroundColor();
            } else {
                console.debug('ExposomeGlobe root element not DOM');
            }
        }
    }
</script>

<style scoped>

</style>
