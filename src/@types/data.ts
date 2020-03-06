export interface Data {
    [key: string]: string | number;

    variable1: string;
    var1_domain: string;
    variable2: string;
    var2_domain: string;
    coef: number;
    value: number;
    linkColor: string;
    rounded: string;
    label: string;
}

export interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

export type HexColor = string;
