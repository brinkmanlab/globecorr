<template>
    <div>
        <div>
            <label>
                Threshold: <textarea v-model="threshold" />
            </label>
            <input type="file" @change="onFileChange" />
        </div>
        <div>
            <div :style="positiveStyles.swatch" @click="displayPositiveColorPicker = !displayPositiveColorPicker">
                <div :style="positiveStyles.color" />
            </div>
            <div v-if="displayPositiveColorPicker" :style="positiveStyles.popover">
                <div :style="positiveStyles.cover" @click="displayPositiveColorPicker = false" />
                <v-color-picker v-model="positiveCorrelationColor" mode="rgba" />
            </div>
            <button @click="handleSubmit">Update colors</button>
        </div>

        <div>
            <div :style="negativeStyles.swatch" @click="displayNegativeColorPicker = !displayNegativeColorPicker">
                <div :style="negativeStyles.color" />
            </div>
            <div v-if="displayNegativeColorPicker" :style="negativeStyles.popover">
                <div :style="negativeStyles.cover" @click="displayNegativeColorPicker = false" />
                <v-color-picker v-model="negativeCorrelationColor" mode="rgba" />
            </div>
        </div>

        <a href="https://raw.githubusercontent.com/brinkmanlab/exposomeglobe/master/data/sample_small.csv?token=AI7O3IS7RRGKDBJTGIFAULK6MXEO2" download>Sample file</a>

        <div id="chartdiv" :style="{ width: '100%', height: '875px' }" ref="chartdiv"></div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";
    import {Chart, ChordDiagramDataItem, ChordNode} from "@amcharts/amcharts4/charts";

    am4core.useTheme(am4themes_animated);

    interface Data {
        [key: string]: any;
        variable1: string;
        var1_domain: string;
        variable2: string;
        var2_domain: string;
        coef: string;
        value: number;
        linkColor: string;
        rounded: string;
        label: string;
    }

    interface RGBA {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    type hexColor = string;

    // TODO: replace with PapaParse
    function loadCSV(text: string): Data[] {
        let arr = text.split("\n");
        let header = ["variable1", "var1_domain", "variable2", "var2_domain", "coef", "value", "linkColor", "label"];
        let data = [];
        for (let i = 1; i < arr.length; i++) {
            let row: Data = {
                variable1: "",
                var1_domain: "",
                variable2: "",
                var2_domain: "",
                coef: "0",
                value: 0,
                linkColor: "#c1cc3d",
                rounded: "0",
                label: "",
            };
            let row_data = arr[i].split(",");
            for (let j = 0; j < header.length; j++)
                row[header[j]] = row_data[j];
            data.push(row);
        }
        return data;
    }

    function getColorDichromatic(correlation: number, positiveColor: hexColor, negativeColor: hexColor): hexColor {
        if (correlation > 0)
            return colorScale(positiveColor, Math.abs(correlation));
        if (correlation < 0)
            return colorScale(negativeColor, Math.abs(correlation));
        return "#D3D3D3"
    }

    function colorScale(hexstr: hexColor, scalefactor: number): hexColor {

        if (scalefactor < 0)
            return hexstr;

        let r = parseInt(hexstr.slice(1, 3), 16);
        let g = parseInt(hexstr.slice(3, 5), 16);
        let b = parseInt(hexstr.slice(5, 7), 16);

        r = r + (225 - r) * (1 - scalefactor);
        g = g + (225 - g) * (1 - scalefactor);
        b = b + (225 - b) * (1 - scalefactor);

        return rgbToHex({r, g, b, a: 1});
    }

    function rgbToHex(rgb: RGBA): string {
        return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    }

    @Component
    export default class ExposomeGlobe extends Vue {
        chart: Chart | null = null;
        threshold: number = 0.6;
        displayPositiveColorPicker: boolean = false;
        displayNegativeColorPicker: boolean = false;
        positiveCorrelationColor: RGBA = {r: 79, g: 117, b: 210, a: 1};
        negativeCorrelationColor: RGBA = {r: 223, g: 60,b: 60, a: 1};
        data: Data[] = [{
            variable1: "",
            var1_domain: "",
            variable2: "",
            var2_domain: "",
            coef: "0",
            value: 0,
            linkColor: "#c1cc3d",
            rounded: "0",
            label: "",
        }];

        get filteredData() {
            return this.data.filter(x=>Math.abs(parseFloat(x.coef)) >= this.threshold);
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

        updated() {
            if (this.$refs["chartdiv"] instanceof HTMLElement) {
                // Export
                let chart = am4core.create(this.$refs["chartdiv"], am4charts.ChordDiagram);
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
                function hover(isHover: boolean): (this: unknown, event: { type: "over" | "out", target: ChordNode } & PointerEvent & am4core.MouseTouchEvent & am4core.PointerEvent) => void {
                    return (event) => {
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
                //@ts-ignore
                nodeTemplate.events.on("over", hover(true));

                // When un-hovering from node, un-hover over links
                //@ts-ignore
                nodeTemplate.events.on("out", hover(false));

                // Node label formatting
                const label = nodeTemplate.label;
                label.relativeRotation = 90;
                label.fillOpacity = 0.4;
                label.marginTop = 100;
                let labelHS = label.states.create("hover");
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

        beforeDestroy() {
            if (this.chart) {
                this.chart.dispose();
            }
        }

        onFileChange(event: InputEvent & {target: EventTarget & {files: FileList}}) {
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
                    const positiveColor = rgbToHex({r: that.positiveCorrelationColor.r, g: that.positiveCorrelationColor.g, b: that.positiveCorrelationColor.b, a: 1});
                    const negativeColor = rgbToHex({r: that.negativeCorrelationColor.r, g: that.negativeCorrelationColor.g, b: that.negativeCorrelationColor.b, a: 1});
                    for (let i = 0; i < filteredData.length; i++) {
                        filteredData[i].linkColor = getColorDichromatic(parseFloat(filteredData[i].coef), positiveColor, negativeColor);
                        filteredData[i].value = Math.abs(parseFloat(filteredData[i].coef));
                        filteredData[i].label = (Math.round(parseFloat(filteredData[i].coef) * 1000) / 1000).toString(10);
                    }
                    that.data = filteredData;
                }
            };
        }

        handleSubmit() {
            const positiveColor = rgbToHex({r: this.positiveCorrelationColor.r, g: this.positiveCorrelationColor.g, b: this.positiveCorrelationColor.b, a: 1});
            const negativeColor = rgbToHex({r: this.negativeCorrelationColor.r, g: this.negativeCorrelationColor.g, b: this.negativeCorrelationColor.b, a: 1});
            for (const datum of this.filteredData) {
                this.$set(datum, 'linkColor', getColorDichromatic(parseFloat(datum.coef), positiveColor, negativeColor));
            }
        }
    }
</script>

<style scoped>

</style>
