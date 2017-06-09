// @flow

import uuid from "uuid";

export type Observablee<T> = Manual<T> | Automatic<T>;
export class Manual<T> extends Observable<T> {
}
export class Automatic<T> ReactiveObservable<T> {
    constructor(fn, ...deps) {
        super(fn, ..deps);
    }
}


type ObservableListener<T> = (Observable<T>) => void;
export class Observable<T> {

    listeners: Array<ObservableListener<T>>;

    constructor() {
        this.listeners = [];
    }

    onChange(listener: ObservableListener<T>) {
        this.listeners.push(listener);
    }

    fireChange(obs: Observable<T>) {
        this.listeners.forEach(l => {
            l(obs);
        });
    }
}

export class ObservableArray<T> extends Observable<Array<Observable<T>>> {

    _value: Array<Observable<T>>;

    constructor(...initialValue: Array<Observable<T>>) {
        super();
        this._value = initialValue ? initialValue.slice() :  [];

        //this._onElementChanged = this._onElementChanged.bind(this);
    }

    push(value: Observable<T>) {
        this._value.push(value);
        value.onChange(this._onElementChanged);
        this.fireChange(this);
    }

    toArray() {
        return this._value.slice();
    }

    _onElementChanged(_element: Observable<T>, _oldValue: ?T, _newValue: T) {
        this.fireChange(this);
    }

    /*[Symbol.iterator]() {
        return this._value.values();
    }*/
}

interface HasValue {
    +value: () => number,
}
export class ReactiveObservable<T: HasValue> extends Observable<T> {
    id: string;
    isAutomatic: boolean;
    isDirty: boolean;
    _value: T;
    _fn: ?() => T;

    constructor(initialValue: ?T, fn: () => T, ...deps: Array<Observable<*>>) {
        super();
        this.id = uuid.v4();
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
        this._trace("getting");
        if (this.isAutomatic && this.isDirty) {
            if (!this._fn) {
                throw new Error("Trying to get the value of an automatic IOCV without a function");
            }

            this._set(this._fn());
            this.isDirty = false;
        } 
        this._trace("got", this._value);
        return this._value;
    }

    value(): number {
        this._trace("reading value", this.get());
        return this.get().value();
    }

    set(value: T) {
        this.isAutomatic = false;
        this._set(value);
    }

    _set(value: T) {
        this._trace("setting value to ", value);

        const oldValue = this._value;
        this._value = value;
        this.fireChange(this);
    }

    makeAuto() {
        this._trace("making auto");

        if (!this._fn) {
            throw new Error("Trying to create automatic brew value withiout giving a way to calculate it");
        }
        this.isAutomatic = true;
        this.invalidate();
    }

    invalidate() {
        this._trace("invalidating");

        this.isDirty = true;
        this.fireChange(this);
    }

    _trace(...msg) {
        console.log(this.id, ...msg);
    }
}


