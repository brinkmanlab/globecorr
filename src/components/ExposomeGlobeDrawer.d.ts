import {RGBA} from "@/@types/data";

export interface Value {
    [key: string]: number | RGBA;
    threshold: number;
    fontSize: number;
    positiveCorrelationColor: RGBA;
    negativeCorrelationColor: RGBA;
}
