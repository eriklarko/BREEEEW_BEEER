// @flow

class Unit {
    _value: number;

    constructor(value: number) {
        this._value = value;
    }

    value(): number {
        return this._value;
    }
}

export class Liters extends Unit {
}

export class Minutes extends Unit {
}

export class Kilos extends Unit {
}
export class Grams extends Unit {
}

export class SpecificGravity extends Unit {
}

export class IBU extends Unit {
}


// 0.xyz
export class Factor extends Unit {
}

// xy.za
export class Percent extends Unit {
    asFactor() {
        return new Factor(this.value() / 100);
    }
}

