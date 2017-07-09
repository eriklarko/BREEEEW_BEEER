// @flow

import uuid from "uuid/v4";

// eslint-disable-next-line
type ObservableListener = (Observable) => void;

export class Observable {
    
    listeners: Array<ObservableListener>;
    id: string;
    name: ?string;

    constructor(name?: ?string) {
        this.id = uuid();
        this.name = name;
        this.listeners = [];
    }

    onChange(listener: ObservableListener) {
        this.listeners.push(listener);
    }

    fireChange(obs: Observable) {
        this._trace('alerting', this.listeners.length, 'listener(s) of change');
        this.listeners.forEach(l => {
            l(obs);
        });
    }

    setName(name: string): * {
        this.name = name;
        return this;
    }

    _trace(...args) {
        if (global.trace) {
            const prefix = this.name || this.constructor.name + " " + this.id;
            console.log(prefix, "--", ...args);
        }
    }
}

export class ObservableArray<T: Observable> extends Observable {
    
    _value: Array<T>;

    constructor(...initialValue: Array<T>) {
        super();
        this._value = [];
        for (const iv of initialValue) {
            this.push(iv);
        }
    }

    push(value: T) {
        this._value.push(value);

        value.onChange(this._onElementChanged.bind(this));

        this.fireChange(this);
    }

    toArray(): Array<T> {
        return this._value.slice();
    }

    _onElementChanged(_element: T) {
        this.fireChange(this);
    }

    /*[Symbol.iterator]() {
        return this._value.values();
    }*/
}
