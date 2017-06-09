// @flow

const realLog = console.log;
console = {
    log: () => {},
}

import { Recipe, LeSec, citra } from "./recipe";
import { IBU, Minutes, Grams, Liters } from "../units";
import { HopAddition } from "../brew-values/hops";

it('should update the bitterness when the hops change', () => {
    const state = new Recipe(LeSec);
    const ibus = state.bitterness.get();

    LeSec.hops.push(new HopAddition(citra, new Minutes(11), new Grams(2)));
    expect(state.bitterness.get().value()).not.toBe(ibus.value());
});

it('should update the boil volume when the boil time changes', () => {
    const state = new Recipe(LeSec);
    
    state.boilTime.set(new Minutes(60));
    const boilVol: number = state.boilVolume.value();
    
    state.boilTime.set(new Minutes(75));
    expect(state.boilVolume.value()).not.toBe(boilVol);
});
