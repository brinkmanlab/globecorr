<template>
  <div :style="{ width: '100%', height: '875px' }" />
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
    import {Chart, ChordDiagramDataItem, ChordNode} from "@amcharts/amcharts4/charts";
    import {Data, RGBA, HexColor} from "@/@types/data";

    am4core.useTheme(am4themesAnimated);

    function rgbToHex(rgb: RGBA): HexColor {
        return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    }

    function colorScale(color: RGBA, scalefactor: number): HexColor {
        if (scalefactor >= 0) {
            color = {
                r: color.r + (225 - color.r) * (1 - scalefactor),
                g: color.g + (225 - color.g) * (1 - scalefactor),
                b: color.b + (225 - color.b) * (1 - scalefactor),
                a: 1, // TODO can we replace all of this with a: datum.coef?
            }
        }

        return rgbToHex(color);
    }

    @Component
    export default class ExposomeGlobe extends Vue {
        private chart: Chart | null = null;
        @Prop(Number) threshold!: number;
        @Prop(Object) positiveCorrelationColor: RGBA = {r: 79, g: 117, b: 210, a: 1};
        @Prop(Object) negativeCorrelationColor: RGBA = {r: 223, g: 60, b: 60, a: 1};
        @Prop(Object) noCorrelationColor: RGBA = {r: 211, g: 211, b: 211, a: 1};
        get noCorrelationColorHex(): HexColor { return rgbToHex(this.positiveCorrelationColor); }
        @Prop(Array) data!: Data[];

        get filteredData(): Data[] {
            return this.data.filter(datum => Math.abs(datum.coef) >= this.threshold).map(datum=>{return {
                ...datum,
                linkColor: datum.coef === 0 ? this.noCorrelationColorHex : colorScale(datum.coef > 0 ? this.positiveCorrelationColor : this.negativeCorrelationColor, Math.abs(datum.coef))
            }});
        }

        positiveStyles = {
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgba(${this.positiveCorrelationColor.r}, ${this.positiveCorrelationColor.g}, ${this.positiveCorrelationColor.b}, ${this.positiveCorrelationColor.a})`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        };

        negativeStyles = {
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgba(${this.negativeCorrelationColor.r}, ${this.negativeCorrelationColor.g}, ${this.negativeCorrelationColor.b}, ${this.negativeCorrelationColor.a})`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        };

        updated(): void {
            if (this.$el instanceof HTMLElement) {
                // Export
                const chart = am4core.create(this.$el, am4charts.ChordDiagram);
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
                chart.sortBy = "name";
                linkTemplate.clickable = false;

                const hoverState = linkTemplate.states.create("hover");
                hoverState.properties.fillOpacity = 1.0;
                hoverState.properties.strokeOpacity = 1.0;
            }
        }

        beforeDestroy(): void {
            if (this.chart) {
                this.chart.dispose();
            }
        }

        /*onFileChange(event: InputEvent & { target: EventTarget & { files: FileList } }) {
            let file = event.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            let that = this;
            reader.onload = function (event) {
                if (event.target && typeof event.target.result === 'string') {
                    const data = loadCSV(event.target.result);
                    const filteredData = data.filter(
                        function (x) {
                            return Math.abs(parseFloat(x.coef)) >= that.threshold;
                        }
                    );
                    const positiveColor = rgbToHex({
                        r: that.positiveCorrelationColor.r,
                        g: that.positiveCorrelationColor.g,
                        b: that.positiveCorrelationColor.b,
                        a: 1
                    });
                    const negativeColor = rgbToHex({
                        r: that.negativeCorrelationColor.r,
                        g: that.negativeCorrelationColor.g,
                        b: that.negativeCorrelationColor.b,
                        a: 1
                    });
                    for (let i = 0; i < filteredData.length; i++) {
                        filteredData[i].linkColor = getColorDichromatic(parseFloat(filteredData[i].coef), positiveColor, negativeColor);
                        filteredData[i].value = Math.abs(parseFloat(filteredData[i].coef));
                        filteredData[i].label = (Math.round(parseFloat(filteredData[i].coef) * 1000) / 1000).toString(10);
                    }
                    that.data = filteredData;
                }
            };
        }*/
    }
</script>

<style scoped>

</style>
