// @flow

import { Percent, Grams, Minutes } from '../units';

export class Hop {
    _name: string;
    _aa: Percent;

    constructor(name: string, alphaAcids: Percent) {
        this._name = name;
        this._aa = alphaAcids;
    }

    getAlphaAcids() {
        return this._aa;
    }
}

export class HopAddition {

    _hop: Hop;
    _amount: Grams;
    _timeInBoil: Minutes;

    constructor(hop: Hop, amount: Grams, timeInBoil: Minutes) {
        this._hop = hop;
        this._amount = amount;
        this._timeInBoil = timeInBoil;
    }

    getHop() {
        return this._hop;
    }

    getAmount() {
        return this._amount;
    }

    getTimeInBoil() {
        return this._timeInBoil;
    }
}
