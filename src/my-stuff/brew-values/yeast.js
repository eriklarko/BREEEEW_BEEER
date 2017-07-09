// @flow

import { Factor } from "../units";
export class Yeast {
    _name: string;
    _attenuation: Factor;

    constructor(name: string, attenuation: Factor) {
        this._name = name;
        this._attenuation = attenuation;
    }

    getAttenuation(): Factor {
        return this._attenuation;
    }
}
