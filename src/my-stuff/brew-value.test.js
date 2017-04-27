// @flow

//import {it, expect} from "jest";

import {BrewValue, DependencyQueue} from "./brew-value";

expect.extend({
    toHaveExactElementsInOrder(received, ...args: Array<BrewValue>) {
        let pass = received.length() === args.length;
        for (let i = 0; i < received.length(); i++) {
            if (received.elementAt(i) !== args[i]) {
                pass = false;
                break;
            }
        }

        let message = "expected\n"
        message += `${JSON.stringify(received, null, 2)}`
        message += `\n\nto ${pass ? "not " : ""}contain the following elements in exact order:\n`
        message += `${args.map(a => JSON.stringify(a, null, 2)).join(", ")}`;
        return {
            pass: pass,
            message: message
        }
    }
});

it('adds inputs to dependency queue', () => {
    const dep1 = new BrewValue(); dep1.id = "dep1";
    const dep2 = new BrewValue(); dep2.id = "dep2";
    const sut = new BrewValue(dep1, dep2);
    const queue = new DependencyQueue();

    sut.invalidate(queue);

    expect(queue).toHaveExactElementsInOrder(dep1, dep2);
});
