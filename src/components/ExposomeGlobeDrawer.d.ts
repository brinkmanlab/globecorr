import {RGBA} from "@/@types/data";

export interface Value {
    [key: string]: number | RGBA | string;
    sort: "value" | "none" | "name";
    threshold: number;
    fontSize: number;
    padding: number;
    positiveCorrelationColor: RGBA;
    negativeCorrelationColor: RGBA;
    backgroundColor: RGBA;
}
