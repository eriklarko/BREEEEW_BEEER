// @flow

import { Observable } from "./observable";

class Unit<T> extends Observable<number> {

    _value: number;

    constructor(value: number) {
        super();
        this._value = value;
    }

    value(): number {
        return this._value;
    }

    set(value: T) {
        this.fireChange(this);
    }
}

export class Liters extends Unit<Liters> {
}

export class Minutes extends Unit<Minutes> {
    asHours(): Hours {
        return new Hours(this.value() / 60);
    }
}
export class Hours extends Unit<Hours> {
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

