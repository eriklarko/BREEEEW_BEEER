// @flow

import { Observable } from "../observable";
import { Kilos, ExtractPotential } from "../units";

export type MaltType = 'extract' | 'grain';

export class Malt {
    _name: string;
    _type: MaltType;
    _ep: ExtractPotential;

    constructor(name: string, extractPotential: ExtractPotential, type: MaltType) {
        this._name = name;
        this._type = type;
        this._ep = extractPotential;
    }

    getName(): string {
        return this._name;
    }

    getType(): MaltType {
        return this._type;
    }

    getExtractPotential(): ExtractPotential {
        return this._ep;
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

    getMalt(): Malt {
        return this._malt;
    }

    getWeight(): Kilos {
        return this._weight;
    }
}
