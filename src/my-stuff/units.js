// @flow

import { Observable } from "./observable";

type ReactiveInfo = {
    fn: () => number,
    deps: Array<Observable>,
};
export class Unit extends Observable {

    deps: Array<Observable>;
    _value: number;
    _isAutomatic: boolean;
    _isDirty: boolean;
    _fn: () => number;

    constructor(value: number | ReactiveInfo, name?: ?string) {
        super(name);
        if (typeof value === "number") {
            this._value = value;
            this._isAutomatic = false;

            this.deps = [];
        } else {
            this._isAutomatic = true;
            this._isDirty = true;

            if (!value.fn) {
                console.log('APPPPA', typeof value, value);
                throw new Error('Tried to set an automatic unit without a function to calculate it');
            }

            this._fn = value.fn;

            this.deps = value.deps;
            for (const dep of value.deps) {
                dep.onChange(() => {
                    this.invalidate();
                });
            }
        }
    }

    value(): number {
        if (this._isAutomatic && this._isDirty) {
            this._trace('re-calculating');
            this._value = this._fn();
            this._trace('calculated value is now', this._value);
            this._isDirty = false;
        }

        return this._value;
    }

    set(value: number) {
        this._trace('going manual by setting value to', value);

        this._isAutomatic = false;
        this._value = value;
        this.fireChange(this);
    }

    invalidate() {
        this._trace('invalidating');
        this._isDirty = true;
        this.fireChange(this);
    }

    _trace(...args) {
        if (global.trace) {
            const prefix = this.name || this.constructor.name + " " + this.id;
            console.log(prefix, "--", ...args);
        }
    }
}

export class Liters extends Unit {
    constructor(v: USGallons | number | ReactiveInfo) {
        if(v instanceof USGallons) {
            super(v.value() / 0.264172);
        } else {
            super(v);
        }
    }
}
export class USGallons extends Unit {
    constructor(v: Liters | number) {
        if(v instanceof Liters) {
            super(0.264172 * v.value());
        } else {
            super(v);
        }
    }
}

export class Minutes extends Unit {
    asHours(): Hours {
        return new Hours(this.value() / 60);
    }
}
export class Hours extends Unit {
}

export class Kilos extends Unit {
    constructor(v: Lbs | number | ReactiveInfo) {
        if(v instanceof Lbs) {
            super(v.value() / 2.20462262);
        } else {
            super(v);
        }
    }
}
export class Grams extends Unit {
}
export class Lbs extends Unit {
    constructor(v: Kilos | number | ReactiveInfo) {
        if(v instanceof Kilos) {
            super(2.20462262 * v.value());
        } else {
            super(v);
        }
    }
}

export class SpecificGravity extends Unit {
}
export class GravityPoints extends Unit {
    toSpecificGravity(): SpecificGravity {
        return new SpecificGravity(this.value() / 1000 + 1);
    }
}
export class ExtractPotential extends Unit {
    _gp: GravityPoints;
    _weight: Kilos;

    constructor(gp: GravityPoints, weight?: Kilos) {
        if (!weight) {
            weight = new Kilos(1);
        }

        super(weight === 0 ? 0 : gp.value() / weight.value());

        this._gp = gp;
        this._weight = weight;
    }

    getGravityPoints(): GravityPoints {
        return this._gp;
    }

    getWeight(): Kilos {
        return this._weight;
    }
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

export class ABV extends Unit {
}

export class Celsius extends Unit {
}
