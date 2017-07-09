// @flow

import { Recipe, LeSec, citra } from "./recipe";
import { IBU, Minutes, Grams, Liters, Kilos, ExtractPotential, GravityPoints } from "../units";
import { HopAddition } from "../brew-values/hops";
import { Malt, MaltAddition } from "../brew-values/malt";

it('should update the bitterness when the hops change', () => {
    const state = new Recipe(LeSec);
    const ibus = state.bitterness.value();

    LeSec.hops.push(new HopAddition(citra, new Grams(2), new Minutes(11)));

    expect(state.bitterness.value()).not.toBe(ibus);
});

it('should update the boil volume when the boil time changes', () => {
    const state = new Recipe(LeSec);
    

    state.boilTime.set(60);
    const boilVol: number = state.postBoilVolume.value();
    
    state.boilTime.set(75);


    expect(state.postBoilVolume.value()).not.toBe(boilVol);
});

it('should update the boil volume when a new malt addition is added', () => {
    const state = new Recipe(LeSec);


    const boilVol = state.postBoilVolume.value();

    state.ingredients.maltBill.push(new MaltAddition(new Malt('2-row', new ExtractPotential(new GravityPoints(37)), 'grain'), new Kilos(1)));


    expect(state.postBoilVolume.value()).not.toBe(boilVol);
})
