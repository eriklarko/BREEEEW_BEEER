// @flow

import { Observable } from "../observable";
import { Kilos } from "../units";

export class Malt {
    _name: string;

    constructor(name: string) {
        this._name = name;
    }
}

export class MaltAddition extends Observable {
    _malt: Malt;
    _weight: Kilos;

    constructor(malt: Malt, weight: Kilos) {
        super();
        this._malt = malt;
        this._weight = weight;
    }

    getWeight(): Kilos {
        return this._weight;
    }
}
