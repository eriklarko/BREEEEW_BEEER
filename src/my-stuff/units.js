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
}

export class Minutes extends Unit {
    asHours(): Hours {
        return new Hours(this.value() / 60);
    }
}
export class Hours extends Unit {
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

export class ABV extends Unit {
}
