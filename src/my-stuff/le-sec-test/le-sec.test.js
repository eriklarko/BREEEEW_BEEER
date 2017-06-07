// @flow

const realLog = console.log;
console = {
    log: () => {},
}

import { Recipe, LeSec, citra } from "./recipe";
import { IBU, Minutes, Grams } from "../units";
import { HopAddition } from "../brew-values/hops";

it('should update the bitterness when the hops change', () => {
    const state = new Recipe(LeSec);
    const ibus = state.bitterness.get();

    expect(ibus.value()).toBe(new IBU(3.9769747601835963).value());

    LeSec.hops.push(new HopAddition(citra, new Minutes(11), new Grams(2)));
    expect(state.bitterness.get().value()).toBe(new IBU(12.554785880681253).value());
});
