import {RGBA} from "@/@types/data";

export interface Value {
    [key: string]: number | RGBA | string;
    sort: string;
    threshold: number;
    fontSize: number;
    positiveCorrelationColor: RGBA;
    negativeCorrelationColor: RGBA;
}
