// @flow

import uuid from "uuid";

export class BrewValue {
    inputs: Array<BrewValue> = [];
    value: ?number = null;
    id = uuid.v4();

    constructor(...inputs: Array<BrewValue>) {
        this.inputs = inputs;
    }

    calculate() {
        this.value = 1;
    }

    invalidate(queue: DependencyQueue) {
        for(const input of this.inputs) {
            queue.add(input);
        }
    }
}

export class DependencyQueue {
    _queue: Array<BrewValue> = [];

    add(brewValue: BrewValue) {
        this._queue.push(brewValue);
    }

    length() : number {
        return this._queue.length;
    }

    elementAt(index: number) {
        return this._queue[index];
    }
}
