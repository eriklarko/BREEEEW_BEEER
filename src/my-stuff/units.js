// @flow

import { Observable } from "./observable";

type ReactiveInfo = {
    fn: () => number,
    deps: Array<Observable>,
};
class Unit extends Observable {

    _value: number;
    _isAutomatic: boolean;
    _isDirty: boolean;
    _fn: () => number;

    constructor(value: number | ReactiveInfo) {
        super();
        if (typeof value === "number") {
            this._value = value;
            this._isAutomatic = false;
        } else {
            this._isAutomatic = true;
            this._isDirty = true;

            this._fn = value.fn;
            for (const dep of value.deps) {
                dep.onChange(() => this.invalidate());
            }
        }
    }

    value(): number {
        if (this._isAutomatic && this._isDirty) {
            this._set(this._fn());
            this._isDirty = false;
        }

        return this._value;
    }

    set(value: number) {
        this._isAutomatic = false;
        this._set(value);
    }

    _set(value: number) {
        this._value = value;
        this.fireChange(this);
    }

    invalidate() {
        this._isDirty = true;
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

