// @flow

type ObservableListener<T> = (Observable<T>, ?T, T) => void;
export class Observable<T> {

    listeners: Array<ObservableListener<T>>;

    constructor() {
        this.listeners = [];
    }

    onChange(listener: ObservableListener<T>) {
        this.listeners.push(listener);
    }

    fireChange(obs: Observable<T>, oldValue: ?T, newValue: T) {
        this.listeners.forEach(l => {
            l(obs, oldValue, newValue)
        });
    }
}

export class ObservableArray<T> extends Observable<Array<Observable<T>>> {

    _value: Array<Observable<T>>;

    constructor(initialValue: Array<Observable<T>>) {
        super();
        this._value = initialValue ? initialValue.slice() :  [];

        //this._onElementChanged = this._onElementChanged.bind(this);
    }

    push(value: Observable<T>) {
        this._value.push(value);
        value.onChange(this._onElementChanged);
        this.fireChange(this, undefined, []);
    }

    toArray() {
        return this._value.slice();
    }

    _onElementChanged(element: Observable<T>, oldValue: ?T, newValue: T) {
        this.fireChange(this, undefined, []);
    }

    /*[Symbol.iterator]() {
        return this._value.values();
    }*/
}

export class ReactiveObservable<T> extends Observable<T> {
    isAutomatic: boolean;
    isDirty: boolean;
    _value: T;
    _fn: ?() => T;

    constructor(initialValue: T, fn: ?() => T, ...deps: Array<Observable<any>>) {
        super();
        this._fn = fn;
 
        if (initialValue) {
            this.set(initialValue);
        } else {
            this.isDirty = true;
            this.makeAuto();
        }

        const i = this.invalidate.bind(this);
        for (const dep of deps) {
            dep.onChange(i);
        }
    }

    get(): T {
        if (this.isAutomatic && this.isDirty) {
            if (!this._fn) {
                throw new Error('Trying to get the value of an automatic IOCV without a function');
            }

            this._set(this._fn())
            this.isDirty = false;
        } 
        return this._value;
    }

    set(value: T) {
        this.isAutomatic = false;
        this._set(value);
    }

    _set(value: T) {
        //console.log('setting value to ', value);

        const oldValue = this._value;
        this._value = value;
        this.fireChange(this, oldValue, this._value);
    }

    makeAuto() {
        //console.log('making auto');

        if (!this._fn) {
            throw new Error('Trying to create automatic brew value withiout giving a way to calculate it');
        }
        this.isAutomatic = true;
        this.invalidate();
    }

    invalidate() {
        //console.log('invalidating');

        this.isDirty = true;
    }
}

