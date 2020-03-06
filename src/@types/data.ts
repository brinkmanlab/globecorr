import {Color, iRGB} from "@amcharts/amcharts4/core";

export interface Data {
    [key: string]: string | number | Color;

    variable1: string;
    var1_domain: string;
    variable2: string;
    var2_domain: string;
    coef: number;
    value: number;
    linkColor: Color;
    label: string;
}

export type RGBA = iRGB;
