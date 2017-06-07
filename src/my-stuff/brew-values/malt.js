// @flow

import { Kilos } from "../units";

export class Malt {
    _name: string;

    constructor(name: string) {
        this._name = name;
    }
}

export class MaltAddition {
    _malt: Malt;
    _weight: Kilos;

    constructor(malt: Malt, weight: Kilos) {
        this._malt = malt;
        this._weight = weight;
    }

    getWeight(): Kilos {
        return this._weight;
    }
}
