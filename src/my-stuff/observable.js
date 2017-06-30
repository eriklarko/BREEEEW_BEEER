// @flow

type ObservableListener = (Observable) => void;

export class Observable {
    
    listeners: Array<ObservableListener>;

    constructor() {
        this.listeners = [];
    }

    onChange(listener: ObservableListener) {
        this.listeners.push(listener);
    }

    fireChange(obs: Observable) {
        this.listeners.forEach(l => {
            l(obs);
        });
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
