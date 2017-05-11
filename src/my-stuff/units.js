// @flow

import { Observable } from "./observable";

class Unit<T: Unit<*>> extends Observable<number> {

    _value: number;

    constructor(value: number) {
        super();
        this._value = value;
    }

    value(): number {
        return this._value;
    }

    set(value: T) {
        const oldVal = this._value;
        this._value = value.value();

        this.fireChange(this, oldVal, this._value);
    }
}

export class Liters extends Unit<Liters> {
}

export class Minutes extends Unit<Minutes> {
}

export class Kilos extends Unit<Kilos> {
}
export class Grams extends Unit<Grams> {
}

export class SpecificGravity extends Unit<SpecificGravity> {
}

export class IBU extends Unit<IBU> {
}


// 0.xyz
export class Factor extends Unit<Factor> {
}

// xy.za
export class Percent extends Unit<Percent> {
    asFactor() {
        return new Factor(this.value() / 100);
    }
}

